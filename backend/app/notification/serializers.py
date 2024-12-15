from rest_framework import serializers
from .models import Notifications

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notifications
        fields = ['notification_id', 'user', 'type', 'content', 'timestamp', 'seen', 'link']
