from game.serializers import ProfileSerializer
from game.models import Profile, GameModel
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import IsAuthenticated
from astropong.serializers.UserSerializer import FriendSerializer, UserSerializer
from astropong.models.UserModel import User, Relationship
from django.http import HttpResponse
from django.conf import settings
from rest_framework import serializers
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.db import models
from rest_framework.parsers import MultiPartParser, FormParser


class GamesHistoryView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            userid = request.data.get('id')
            user_profile = Profile.objects.get(user_id=userid)
            games = GameModel.get_all_games(user_profile.id).order_by('-created')
            history = []
            for game in games:
                opponent = game.get_opponent(user_profile)
                score = game.get_player_game_score(user_profile.id)
                opponent_score = game.get_player_game_score(opponent.id)
                
                match_data = {
                    'gameId': game.id,
                    'date': game.created,
                    'player':{
                        'username': user_profile.get_username(),
                        'picture': user_profile.get_profile_pic(request),
                    },
                    'opponent':{
                        'username': opponent.get_username(),
                        'picture': opponent.get_profile_pic(request),
                    },
                    'score': {
                        'user': score,
                        'opponent': opponent_score,
                    },
                    'result': 'Win' if score > opponent_score else 'Loss' if score < opponent_score else 'Draw'
                }
                history.append(match_data)
                
            return Response({
                'history': history
            })
            
        except Profile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=404)
        
class PlayerWinRateView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            user_profile = Profile.objects.get(user_id=request.user)
            games = GameModel.get_all_games(user_profile.id)
            
            total_games = games.count()
            wins = 0
            
            for game in games:
                player_score = game.get_player_game_score(user_profile.id)
                opponent = game.get_opponent(user_profile)
                opponent_score = game.get_player_game_score(opponent.id)
                
                if player_score > opponent_score:
                    wins += 1
            
            return Response({
                'totalGames': total_games,
                'wins': wins,
                'winRate': round((wins / total_games * 100) if total_games > 0 else 0, 2)
            })
            
        except Profile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=404)
        
class TopPlayersView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            # user_profile = Profile.objects.get(user_id=request.user)
            top_players = Profile.objects.order_by('-xp')[:3]
            return Response({'topPlayers': 
                ProfileSerializer(top_players, many=True, context={'request': request}).data
            })
        except Profile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=404)
        
class PlayerRanking(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            ranking = Profile.objects.order_by('-xp')
            return Response({'ranking': ProfileSerializer(ranking, many=True, context={'request': request}).data})
        except Profile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=404)
