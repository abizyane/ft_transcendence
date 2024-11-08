from rest_framework import serializers
from .models import Message
from astropong.models.UserModel import User, Relationship

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'profile_pic']

class MessageUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)

    def to_representation(self, instance):
        return {
            'message_id': instance.message_id,
            'sender': instance.sender.username,
            'receiver': instance.receiver.username,
            'message': instance.message,
            'timestamp': instance.timestamp,
            'seen': instance.seen
        }

    class Meta:
        model = Message
        fields = ['message_id', 'sender', 'receiver', 'message', 'timestamp', 'seen']

class ChatRoomSerializer(serializers.Serializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)
    messages = MessageSerializer(many=True)

    def to_representation(self, instance):
        return {
            'user': instance.sender if instance.sender.username != self.request.user.username else instance.receiver,
            'messages': instance.messages,
        }
    class Meta:
        fields = ['sender', 'receiver', 'messages']

class ConversationSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)

    def to_representation(self, instance):
        return {
            'username': instance.sender.username if instance.sender.username != self.request.user.username else instance.receiver.username,
            'profile_pic': instance.sender.profile_pic if instance.sender.username != self.request.user.username else instance.receiver.profile_pic,
            'message': instance.message,
            'timestamp': instance.timestamp,
            'seen': instance.seen
        }
    class Meta:
        model = Message
        # list_serializer_class = ConversationsListSerializer
        fields = ['message', 'timestamp', 'seen', 'sender', 'receiver']
