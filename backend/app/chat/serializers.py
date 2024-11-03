from rest_framework import serializers
from .models import Message
from astropong.models.UserModel import User, Relationship

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'profile_pic', 'is_online']

class MessageUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']

class MessageSerializer(serializers.ModelSerializer):
    sender = MessageUserSerializer(read_only=True)
    receiver = MessageUserSerializer(read_only=True)
    class Meta:
        model = Message
        fields = ['message_id', 'sender', 'receiver', 'message', 'timestamp', 'seen']

class ChatRoomSerializer(serializers.Serializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)
    messages = MessageSerializer(many=True)

    class Meta:
        fields = ['sender', 'receiver', 'messages']

class ConversationSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['message_id','message', 'timestamp', 'seen', 'sender', 'receiver']
