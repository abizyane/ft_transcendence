from astropong.serializers.UserSerializer import UserSerializer
from rest_framework import serializers
from .models import GameModel, Profile, TournamentModel

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameModel
        fields = '__all__'

class ProfileSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    matches_played = serializers.SerializerMethodField()
    rank = serializers.SerializerMethodField()
    class Meta:
        model = Profile
        fields = ['xp', 'level', 'user', 'matches_played', 'rank']

    def get_user(self, obj):
        return UserSerializer(obj.user_id, context=self.context).data
    
    def get_matches_played(self, obj):
        return GameModel.get_all_games(obj.id).count()

    def get_rank(self, obj):
        ranking = list(Profile.objects.order_by('-xp'))
        return ranking.index(obj) + 1

    
class TournamentSerializer(serializers.ModelSerializer) :
    games = GameSerializer(many=True);
    winner = ProfileSerializer()
    class Meta :
        model = TournamentModel
        fields = ['name', 'games', 'winner']