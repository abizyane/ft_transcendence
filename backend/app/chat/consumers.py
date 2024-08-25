
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.db.models import Q
from .models import Message
from astropong.models.UserModel import User, Relationship
from .views import MessageSerializer
from channels.layers import get_channel_layer
from datetime import datetime

class ChatRoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]
        sender = self.scope["url_route"]["kwargs"]["sender"]
        receiver = self.scope["url_route"]["kwargs"]["receiver"]
        
        self.sender = sender
        self.receiver = receiver

        # if user.is_anonymous or (user.username != sender and user.username != receiver):
        #     await self.accept() 
        #     await self.send_error(f"{user} is not allowed to connect to this chat.")
        #     await self.close()
        #     return

        sorted_users = sorted([sender, receiver])
        self.room_group_name = '_'.join(sorted_users)

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        await self.close()

    async def receive(self, text_data):
        text_data_json = await self.validate_json(text_data)
        if not text_data_json:
            return
        
        message_type = text_data_json.get('type')

        if message_type == 'chat_message':
            await self.handle_chat_message(text_data_json)
        elif message_type == 'typing':
            await self.handle_typing(text_data_json)
        elif message_type == 'stop_typing':
            await self.handle_stop_typing(text_data_json)
        else:
            await self.send_error('Invalid message type.')

    async def handle_chat_message(self, text_data_json):
        sender, receiver = await self.get_users()
        if not sender or not receiver:
            await self.send_error('User not found.')
            return

        relationship = await self.get_relationship(sender, receiver)
        if not relationship:
            await self.send_error('You must be friends in order to chat.')
            return

        message = await self.save_message(sender, receiver, text_data_json['message'])
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': MessageSerializer(message).data,
            }
        )

        await self.send_notification(sender, receiver)

    async def handle_typing(self, text_data_json):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'typing',
                'sender': self.sender,
                'receiver': self.receiver,
            }
        )

    async def handle_stop_typing(self, text_data_json):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'stop_typing',
                'sender': self.sender,
                'receiver': self.receiver,
            }
        )

    async def chat_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'message': message,
            'type': 'chat_message',
        }))

    async def typing(self, event):
        await self.send(text_data=json.dumps({
            'type': 'typing',
            'sender': event['sender'],
            'receiver': event['receiver'],
        }))

    async def stop_typing(self, event):
        await self.send(text_data=json.dumps({
            'type': 'stop_typing',
            'sender': event['sender'],
            'receiver': event['receiver'],
        }))

    async def send_notification(self, sender, receiver):
        channel_layer = get_channel_layer()
        await channel_layer.group_send(
            'notifications_' + receiver.username,
            {
                'type': 'notification',
                'content': f'New message from {sender.username}',
                'sender': sender.username,
                'receiver': receiver.username,
                'notification_type': 'chat_message',
                'timestamp': str(datetime.now()),
                'seen': False,
            }
        )

    @database_sync_to_async
    def get_user(self, username):
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            return None

    @database_sync_to_async
    def get_relationship(self, sender, receiver):
        return Relationship.objects.filter(
            Q(user1=sender, user2=receiver) | Q(user1=receiver, user2=sender),
            status=Relationship.Status.FRIEND).exists()

    @database_sync_to_async
    def save_message(self, sender, receiver, message):
        return Message.objects.create(sender=sender, receiver=receiver, message=message)

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
