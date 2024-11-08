from rest_framework import serializers
from ..models.UserModel import User, Relationship
from game.models import Profile
from urllib.parse import urljoin
from django.conf import settings
from django.db import models

class UserSerializer(serializers.ModelSerializer):
    profile_pic_url = serializers.SerializerMethodField()
    xp = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password','profile_pic','profile_pic_url','xp']
        extra_kwargs = {
            'password': {'write_only':True},
            'profile_pic': {'write_only':True}
        }
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        p = Profile.objects.create(user_id=instance, level=0,xp=0)
        p.save()
        return instance
    def get_profile_pic_url(self, obj):
        request = self.context.get('request')
        if request is None:
            return None
        default_image_url = urljoin(request.build_absolute_uri(settings.MEDIA_URL), "Profil.jpg")
        if obj.profile_pic:
            return request.build_absolute_uri(obj.profile_pic)
        return default_image_url
    def get_xp(self, obj):
        return obj.profile.xp if hasattr(obj, 'profile') else 0


class RelationshipSerializer(serializers.ModelSerializer):
    friend = serializers.SerializerMethodField()

    class Meta:
        model = Relationship
        fields = ['friend', 'status']
    
    def get_friend(self, obj):
        user = self.context.get('user')
        friend = obj.user2 if obj.user1 == user else obj.user1
        return UserSerializer(friend, context=self.context).data



class FriendSerializer(serializers.ModelSerializer):
    profile_pic_url = serializers.SerializerMethodField()
    is_online = serializers.BooleanField()
    relationship = serializers.SerializerMethodField()
    xp = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile_pic_url', 'is_online', 'relationship', 'xp']

    def get_profile_pic_url(self, obj):
        request = self.context.get('request')
        if request is None:
            return None
        default_image_url = urljoin(request.build_absolute_uri(settings.MEDIA_URL), "Profil.jpg")
        if obj.profile_pic:
            return request.build_absolute_uri(obj.profile_pic)
        return default_image_url

    def get_relationship(self, obj):
        # Find the relationship status for the current user in context
        relationships = self.context.get('relationships', [])
        for friend, status in relationships:
            if friend == obj:
                return Relationship.Status(status).label
        return "Unknown"
    def get_xp(self, obj):
        return obj.profile.xp if hasattr(obj, 'profile') else 0