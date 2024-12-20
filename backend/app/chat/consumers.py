import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.db.models import Q
from .models import Message
from astropong.models.UserModel import User, Relationship
from .serializers import MessageConsumerSerializer, UserSerializer
from django.core.cache import cache

class ChatRoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "chat_room"
        
        self.sender = None
        self.receiver = None
        self.latest_type = None

        user = self.scope["user"]
        if user.is_anonymous or not user.is_authenticated:
            await self.accept() 
            await self.send_error(f"{user} is not authenticated.")
            await self.close()
            return

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        if self.sender and self.receiver and self.latest_type == 'typing':
            await self.handle_stop_typing()

        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
        await self.close()

    async def receive(self, text_data):
        text_data_json = await self.validate_json(text_data)
        if not text_data_json:
            return
        
        self.sender = text_data_json.get('sender')
        self.receiver = text_data_json.get('receiver')
        
        if self.sender != self.scope['user'].username and self.receiver != self.scope['user'].username:
            return
        
        self.sender, self.receiver = await self.get_users()

        if not self.sender or not self.receiver:
            await self.send_error('User not found.')
            return

        message_type = text_data_json.get('type')
        self.latest_type = message_type

        if message_type == 'read_message':
            await self.handle_read_message()
            return
        
        relationship = await self.get_relationship(self.sender, self.receiver)
        if not relationship:
            await self.send_error('You must be friends in order to chat.')
            return

        if message_type == 'chat_message':
            await self.handle_chat_message(text_data_json)
        elif message_type == 'typing':
            await self.handle_typing()
        elif message_type == 'stop_typing':
            await self.handle_stop_typing()
        elif message_type == 'delete_message':
            await self.handle_delete_message(text_data_json)
        elif message_type == 'online_users':
            await self.handle_online_users()
        else:
            await self.send_error('Invalid message type.')

    async def handle_chat_message(self, text_data_json):
        message = await self.save_message(self.sender, self.receiver, text_data_json['message'])
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'chat_message',
                'message': MessageConsumerSerializer(message).data,
                'sender': self.sender.username,
                'receiver': self.receiver.username,
                'sender_id': self.sender.id,
                'receiver_id': self.receiver.id,
            }
        )

        await self.send_notification(self.sender, self.receiver, text_data_json['message']) 

    async def handle_typing(self):
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'typing',
                'sender': self.sender.username,
                'receiver': self.receiver.username,
                'sender_id': self.sender.id,
                'receiver_id': self.receiver.id,
            }
        )

    async def handle_stop_typing(self):
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'stop_typing',
                'sender': self.sender.username,
                'receiver': self.receiver.username,
                'sender_id': self.sender.id,
                'receiver_id': self.receiver.id,
            }
        )

    async def handle_read_message(self):
        await self.mark_messages_as_read(self.sender, self.receiver)

    async def handle_delete_message(self, text_data_json):
        await self.delete_message(text_data_json['message_id'])

    async def handle_online_users(self):
        online_users = await self.get_online_users()
        await self.send(text_data=json.dumps({
            'type': 'online_users',
            'users': UserSerializer(online_users, many=True, context={'request': self.scope['request']}).data,
        }))

    async def chat_message(self, event):
        receiver = event['receiver']
        if receiver != self.scope['user'].username and self.sender != self.scope['user'].username:
            return

        message = event['message']
        await self.send(text_data=json.dumps({
            'message': message,
            'type': 'chat_message',
        }))

    async def typing(self, event):
        receiver = event['receiver']
        if receiver != self.scope['user'].username:
            return

        await self.send(text_data=json.dumps({
            'type': 'typing',
            'sender': event['sender'],
            'receiver': event['receiver'],
        }))

    async def stop_typing(self, event):
        receiver = event['receiver']
        if receiver != self.scope['user'].username:
            return

        await self.send(text_data=json.dumps({
            'type': 'stop_typing',
            'sender': event['sender'],
            'receiver': event['receiver'],
        }))

    async def user_status(self, event):
        receiver = event['receiver']

        await self.send(text_data=json.dumps({
            'type': 'user_status',
            'username': receiver,
            'user_id': event['user_id'],
            'is_online': event['is_online']
        }))

    async def send_notification(self, sender, receiver, message):
        print("sending notification", sender.username, receiver.username, flush=True)
        await self.channel_layer.group_send(
            'notifications_'+receiver.username,
            {
                'type': 'notification',
                'content': f'New message from {sender.username}\n{message}',
                'receiver': receiver.username,
                'notification_type': 'chat_message',
            }
        )

    async def validate_json(self, text_data):
        try:
            return json.loads(text_data)
        except json.JSONDecodeError:
            await self.send_error(f"Invalid JSON: {text_data}")
            return None

    async def get_users(self):
        sender = await self.get_user(self.sender)
        receiver = await self.get_user(self.receiver)
        return sender, receiver

    async def send_error(self, error_message):
        await self.send(text_data=json.dumps({
            'message': error_message,
            'type': 'error',
        }))

    @database_sync_to_async
    def get_online_users(self):
        friends_relationships = Relationship.objects.filter(Q(user1=self.scope['user']) | Q(user2=self.scope['user']), status=Relationship.Status.FRIEND)
        friends_usernames = [relationship.user1.username if relationship.user1 != self.scope['user'] else relationship.user2.username for relationship in friends_relationships]
        online_users = User.objects.filter(username__in=friends_usernames, is_online=True)
        return online_users


    @database_sync_to_async
    def delete_message(self, message_id):
        Message.objects.filter(id=message_id).delete()

    @database_sync_to_async
    def mark_messages_as_read(self, sender, receiver):
        Message.objects.filter(sender=sender, receiver=receiver, seen=False).update(seen=True)

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

    @database_sync_to_async
    def get_relationship(self, sender, receiver):
        combined_key = f"relationship_{sender.username}_{receiver.username}" if sender.username < receiver.username else f"relationship_{receiver.username}_{sender.username}"
        relationship = cache.get(combined_key)
        if relationship:
            return relationship
        else:
            relationship = Relationship.objects.filter(
                Q(user1=sender, user2=receiver) | Q(user1=receiver, user2=sender),
                status=Relationship.Status.FRIEND).exists()
            cache.set(combined_key, relationship, timeout=30)
            return relationship

    @database_sync_to_async
    def save_message(self, sender, receiver, message):
        return Message.objects.create(
            sender=sender,
            receiver=receiver,
            message=message
        )
