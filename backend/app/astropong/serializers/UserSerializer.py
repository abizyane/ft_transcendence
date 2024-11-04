from rest_framework import serializers
from ..models.UserModel import User
from game.models import Profile

class UserSerializer(serializers.ModelSerializer):
    profile_pic_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password','profile_pic_url']
        extra_kwargs = {
            'password': {'write_only':True}
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
        if obj.profile_pic:
            return request.build_absolute_uri(obj.profile_pic.url)
        return None

