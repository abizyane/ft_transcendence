from game.serializers import ProfileSerializer
from game.models import Profile, GameModel, Scores, TournamentModel, PlayerModel
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
from datetime import datetime, timedelta
from django.db.models import Q
from django.utils import timezone


class TournamentHistoryView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        userid = request.data.get('id')
        profile = Profile.objects.get(user_id=userid)
        tournaments = TournamentModel.get_all_tournaments(profile.id)
        tournaments_data = []
        for tournament in tournaments:
            matchs = []
            for match in tournament.games.all():
                player_1 = UserSerializer(User.objects.get(id=match.player_1.profile.user_id_id), context={'request': request}).data
                player_2 = UserSerializer(User.objects.get(id=match.player_2.profile.user_id_id), context={'request': request}).data
                matchs.append({
                    'type': match.type,
                    'player' : {
                        'username': match.player_1.alias,
                        'picture': player_1.get('profile_pic_url'),
                    },
                    'opponent': {
                        'username': match.player_2.alias,
                        'picture': player_2.get('profile_pic_url'),
                    },
                    'score': {
                        'user': match.get_player_game_score(match.player_1.profile.id),
                        'opponent': match.get_player_game_score(match.player_2.profile.id),
                    },
                    'result': 'Win' if match.get_player_game_score(match.player_1.profile.id) > match.get_player_game_score(match.player_2.profile.id) else 'Loss' if match.get_player_game_score(match.player_1.profile.id) < match.get_player_game_score(match.player_2.profile.id) else 'Draw'
                })

            tournaments_data.append({
                'name': tournament.name,
                'picture': tournament.picture,
                'winner': tournament.winner.get_username(),
                'date': tournament.created,
                "matchs" : matchs
            })
        return Response({'tournaments': tournaments_data})

class GamesHistoryView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            userid = request.data.get('id')
            if userid is None:
                raise Profile.DoesNotExist
            user_profile = Profile.objects.get(user_id=userid)
            games = GameModel.get_all_games(user_profile.id).order_by('-created')
            history = []
            
            for game in games:
                # Determine which PlayerModel belongs to the user and opponent
                current_player = game.player_1 if game.player_1.profile.id == user_profile.id else game.player_2
                player1 = game.player_1.profile
                opponent_player = game.player_2.profile
                opponent_score = game.get_player_game_score(opponent_player.id)
                score = Scores.objects.get(game_id=game.id)
                
                match_data = {
                    'gameId': game.id,
                    'date': game.created,
                    'player': {
                        'username': player1.get_username(),
                        'picture': player1.get_profile_pic(request),
                    },
                    'opponent': {
                        'username': opponent_player.get_username(),
                        'picture': opponent_player.get_profile_pic(request),
                    },
                    'score': {
                        'user': score.score_1,
                        'opponent': score.score_2,
                    },
                    'result': 'Win' if current_player.state == PlayerModel.State.WIN else 'Loss' if current_player.state == PlayerModel.State.LOSE else 'Draw'
                }
                history.append(match_data)
                
            return Response({
                'history': history
            })
            
        except Profile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=404)
        
class PlayerWinRateView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            userid = request.data.get('id')
            user_profile = Profile.objects.get(user_id=userid)
            
            wins = user_profile.get_wins()
            losses = user_profile.get_losses()
            draws = user_profile.get_draws()
            total_games = wins + losses + draws
            
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

            
        
class WeeklyStatsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            userid = request.data.get('id')
            user_profile = Profile.objects.get(user_id=userid)
            
            end_date = timezone.now().replace(hour=23, minute=59, second=59)
            start_date = (end_date - timedelta(days=6)).replace(hour=0, minute=0, second=0)
            
            games = GameModel.get_all_games(user_profile.id).filter(
                created__range=(start_date, end_date)
            )
            
            daily_stats = {}
            for i in range(6, -1, -1): 
                label = f'D-{i}' if i > 0 else 'D'
                date = end_date - timedelta(days=i)
                daily_stats[label] = {
                    'wins': 0,
                    'losses': 0,
                    'date': date.strftime('%Y-%m-%d') 
                }
            
            for game in games:
                days_diff = (end_date - game.created).days
                label = f'D-{days_diff}' if days_diff > 0 else 'D'
                
                if label in daily_stats:
                    player_score = game.get_player_game_score(user_profile.id)
                    opponent = game.get_opponent(user_profile)
                    opponent_score = game.get_player_game_score(opponent.id)
                    
                    if player_score > opponent_score:
                        daily_stats[label]['wins'] += 1
                    elif player_score < opponent_score:
                        daily_stats[label]['losses'] += 1
            
            return Response({
                'dailyStats': daily_stats
            })
            
        except Profile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=404)

class WeeklyXPView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            userid = request.data.get('id')
            user_profile = Profile.objects.get(user_id=userid)
            
            end_date = timezone.now().replace(hour=23, minute=59, second=59)
            start_date = (end_date - timedelta(days=6)).replace(hour=0, minute=0, second=0)
            
            games = GameModel.get_all_games(user_profile.id).filter(
                created__range=(start_date, end_date)
            )
            
            daily_xp = {}
            for i in range(6, -1, -1):
                label = f'D-{i}' if i > 0 else 'D'
                date = end_date - timedelta(days=i)
                daily_xp[label] = {
                    'xp_gained': 0,
                    'date': date.strftime('%Y-%m-%d')
                }
            
            for game in games:
                days_diff = (end_date - game.created).days
                label = f'D-{days_diff}' if days_diff > 0 else 'D'
                
                if label in daily_xp:
                    xp_gained = game.get_player_game_xp(user_profile.id)
                    daily_xp[label]['xp_gained'] += xp_gained
            
            return Response({
                'dailyXP': daily_xp
            })
            
        except Profile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=404)
        
class DashboardView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            userid = request.data.get('id')
            user_profile = Profile.objects.get(user_id=userid)
            
            # Use the new Profile methods to get stats
            wins = user_profile.get_wins()
            losses = user_profile.get_losses()
            draws = user_profile.get_draws()
            total_games = wins + losses + draws
            
            tournament_wins = user_profile.get_tournament_wins()
            tournament_losses = user_profile.get_tournament_losses()

            return Response({
                'totalGames': total_games,
                'wins': wins,
                'losses': losses,
                'draws': draws,
                'tournamentWins': tournament_wins,
                'tournamentLosses': tournament_losses
            })
        except Profile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=404)