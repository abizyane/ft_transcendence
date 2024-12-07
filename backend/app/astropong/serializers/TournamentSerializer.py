from game.models import TournamentModel
from rest_framework import serializers
from urllib.parse import urljoin
from django.conf import settings
from astropong.serializers.UserSerializer import UserSerializer



class TournamentSerializer(serializers.ModelSerializer):
    picture_url = serializers.SerializerMethodField()
    player_names = serializers.SerializerMethodField()
    class Meta:
        model = TournamentModel
        fields = ['id', 'name', 'permission', 'picture_url', 'player_names']
        extra_kwargs = {
            'password': {'write_only':True},
            'profile_pic': {'write_only':True}
        }

    def get_picture_url(self, obj):
        request = self.context.get('request')
        if request is None:
            return None
        default_image_url = urljoin(request.build_absolute_uri(settings.MEDIA_URL), "Tournament.jpeg")
        
        return request.build_absolute_uri(obj.picture.url) if obj.picture else request.build_absolute_uri(default_image_url)

    def get_player_names(self, obj):
        return [UserSerializer(player.user_id, context=self.context).data for player in obj.players.all()]