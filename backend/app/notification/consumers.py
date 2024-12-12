import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Notifications
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from astropong.models.UserModel import User
from django.core.cache import cache

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "notifications"
        user = self.scope["user"]
        if user.is_anonymous or not user.is_authenticated:
            await self.accept() 
            await self.send_error(f"{user} is not authenticated.")
            await self.close()
            return
        # self.group_name += "_" + user.username
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.channel_layer.group_add(
            self.group_name+"_"+user.username,
            self.channel_name
        )
        await self.accept()
        await self.set_user_online(user.username, True)
        await self.notify_online_user(user.username, True, user.id)

    async def disconnect(self, close_code):
        await self.set_user_online(self.scope['user'].username, False)
        await self.notify_online_user(self.scope['user'].username, False, self.scope['user'].id)
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
        await self.close()

    async def receive(self, text_data):
        text_data_json = self.validate_json(text_data)
        if not text_data_json:
            return
        
        if text_data_json['type'] == 'mark_as_seen':
            notification_id = text_data_json['notification_id']
            await self.mark_notification_as_seen(notification_id)
        elif text_data_json['type'] == 'all_seen':
            await self.mark_all_notifications_as_seen()
        else:
            await self.send_error(f"Invalid message type: {text_data_json['type']}")

    async def notify_online_user(self, username, online, user_id):
        # await self.channel_layer.group_send(
        #     "notifications",
        await self.channel_layer.group_send(
            "chat_room",
            {
                'type': 'user_status',
                'receiver': username,
                'is_online': online,
                'user_id': user_id
            }
        )
    
    # async def user_status(self, event):
    #     await self.channel_layer.group_send(
    #         "chat_room",
    #         {
    #             'type': 'user_status',
    #             'receiver': event['receiver'],
    #             'is_online': event['is_online'],
    #             'user_id': event['user_id']
    #         }
    #     )
  
    async def notification(self, event):
        receiver = event['receiver']
        if receiver != 'all' and receiver != self.scope['user'].username:
            return
        receiver = self.scope['user'].username if receiver == 'all' else receiver
        notification = await self.create_notification(receiver, event['notification_type'], event['content'])
        if notification:
            await self.send(text_data=json.dumps({
                'notification_id': notification.notification_id,
                'user': notification.user.username,
                'type': notification.type,
                'content': notification.content,
                'timestamp': str(notification.timestamp),
                'seen': notification.seen,
            }))

    async def notify_user(self, content, notification_type, receiver = None): #this can be used to notify all users or a specific user
        await self.channel_layer.group_send(
            "notifications",
            {
                'type': 'notification',
                'receiver': receiver if receiver else 'all',
                'content': content,
                'notification_type': notification_type
            }
        )

    @database_sync_to_async
    def set_user_online(self, username, online):
        try:
            user = User.objects.get(username=username)
            user.is_online = online
            user.save()
            
        except Exception as e:
            print(f"Error setting user {username} to {online}: {e}", flush=True)

    @database_sync_to_async
    def mark_notification_as_seen(self, notification_id):
        try:
            Notifications.objects.filter(notification_id=notification_id).update(seen=True)
        except Notifications.DoesNotExist:
            self.send(text_data=json.dumps({
                'error': 'Notification does not exist'
        }))

    @database_sync_to_async
    def mark_all_notifications_as_seen(self):
        try:
            Notifications.objects.filter(user=self.scope['user'], seen=False).update(seen=True)
        except Notifications.DoesNotExist:
            self.send(text_data=json.dumps({
                'error': 'No notifications to mark as seen'
            }))

    @database_sync_to_async
    def create_notification(self, receiver, type, content):
        # user = self.get_user(receiver)
        # if not user:
        try:
            receiver = User.objects.get(username=receiver)
        except User.DoesNotExist:
            print(f"User {receiver} does not exist")
            return None
        return Notifications.objects.create(user=receiver, type=type, content=content)

    @database_sync_to_async
    def get_user(self, username):
        cached_user = cache.get(f"user_{username}")
        if cached_user:
            return cached_user
        else:
            try:
                user = User.objects.get(username=username)
                cache.set(f"user_{username}", user, timeout=300)
                return user
            except User.DoesNotExist:
                return None