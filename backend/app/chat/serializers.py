from rest_framework import serializers
from .models import Message
from astropong.models.UserModel import User
from urllib.parse import urljoin
from django.conf import settings

class UserSerializer(serializers.ModelSerializer):
    profile_pic = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'profile_pic', 'is_online']

    def get_profile_pic(self, obj):
        request = self.context.get('request')
        if request is None:
            return None
        default_image_url = urljoin(request.build_absolute_uri(settings.MEDIA_URL), "Profil.jpg")
        if obj.profile_pic:
            return request.build_absolute_uri(obj.profile_pic)
        return default_image_url

class MessageConsumerSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()
    receiver = serializers.SerializerMethodField()

    def get_sender(self, obj):
        return obj.sender.username

    def get_receiver(self, obj):
        return obj.receiver.username

    class Meta:
        model = Message
        fields = ['message_id', 'sender', 'receiver', 'message', 'timestamp', 'seen']

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

class ChatRoomSerializer(serializers.Serializer):
    messages = serializers.SerializerMethodField()

    def get_messages(self, obj):
        return MessageSerializer(obj['messages'], many=True, context=self.context).data

    def to_representation(self, instance):
        user = instance['receiver'] if instance['sender'].username == self.context['request'].user.username else instance['sender']
        return {
            'user': UserSerializer(user, context=self.context).data,
            'messages': self.get_messages(instance),
            'next': instance['next'],
            'previous': instance['previous'],
        }

class ConversationSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()
    receiver = serializers.SerializerMethodField()

    def get_sender(self, obj):
        return UserSerializer(obj.sender, context=self.context).data
    
    def get_receiver(self, obj):
        return UserSerializer(obj.receiver, context=self.context).data

    def to_representation(self, instance):
        current_user = self.context['request'].user
        other_user = instance.sender if instance.sender.id != current_user.id else instance.receiver
        
        return {
            'id': other_user.id,
            'username': other_user.username,
            'profile_pic': UserSerializer(other_user, context=self.context).data['profile_pic'],
            'is_online': other_user.is_online,
            'message': instance.message,
            'timestamp': instance.timestamp,
            'seen': instance.seen
        }
