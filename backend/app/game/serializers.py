from astropong.serializers.UserSerializer import UserSerializer
from rest_framework import serializers
from .models import GameModel, Profile

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameModel
        fields = '__all__'

class ProfileSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    
    class Meta:
        model = Profile
        fields = ['xp', 'level', 'user']

    def get_user(self, obj):
        return UserSerializer(obj.user_id, context=self.context).data

    
