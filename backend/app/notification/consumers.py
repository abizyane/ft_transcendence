import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Notifications
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "notifications"
        user = self.scope["user"]
        if user.is_anonymous or not user.is_authenticated:
            await self.accept() 
            await self.send_error(f"{user} is not authenticated.")
            await self.close()
            return
        
        self.group_name += "_" + user.username
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = self.validate_json(text_data)
        if not text_data_json:
            return
        
        notification_id = text_data_json['notification_id']
        await self.mark_notification_as_seen(notification_id)

    @database_sync_to_async
    def mark_notification_as_seen(self, notification_id):
        try:
            notification = Notifications.objects.get(notification_id=notification_id)
            notification.seen = True
            notification.save()
        except Notifications.DoesNotExist:
            self.send(text_data=json.dumps({
                'error': 'Notification does not exist'
        }))

    @database_sync_to_async
    def create_notification(self, receiver, type, content):
        User = get_user_model()
        try:
            receiver = User.objects.get(username=receiver)
        except User.DoesNotExist:
            print(f"User {receiver} does not exist")
            return
        return Notifications.objects.create(user=receiver, type=type, content=content)

    async def notification(self, event):
        notification = await self.create_notification(event['receiver'], event['notification_type'], event['content'])
        await self.send(text_data=json.dumps({
            'notification_id': notification.notification_id,
            'user': notification.user.username,
            'type': notification.type,
            'content': notification.content,
            'timestamp': notification.timestamp,
            'seen': notification.seen,
        }))
