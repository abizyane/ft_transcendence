from django.core.exceptions import ValidationError
from django.db import models

from astropong.serializers.TournamentSerializer import TournamentSerializer
from game.models import TournamentModel, TournamentPic
from ...models.UserModel import Relationship
from ...serializers.UserSerializer import FriendSerializer, UserSerializer
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from ...models.UserModel import User, Relationship

from chat.serializers import UserSerializer as MinUserSerializer
from rest_framework import generics
from rest_framework.exceptions import NotAuthenticated, NotFound
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import serializers
import os
from django.conf import settings



# class PublicTournamentView(APIView):
#     permission_classes = [IsAuthenticated]
#     def get(self, request):
#         try:
#             tournaments = TournamentModel.objects.filter(
#                 (models.Q(state=TournamentModel.State.SCHEDULED) & 
#                 models.Q(permission=TournamentModel.Permission.PUBLIC)) |
#                 (models.Q(state=TournamentModel.State.SCHEDULED) & 
#                 models.Q(permission=TournamentModel.Permission.PRIVATE) & 
#                 (models.Q(players=request.user.profile) | models.Q(owner=request.user.profile) | models.Q(invites=request.user.profile))
#             ))
#             serializer = TournamentSerializer(tournaments, context={'request': request}, many=True)
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         except TournamentModel.DoesNotExist:
#             return Response([], status=status.HTTP_200_OK)
    
class TournamentPicUploadSerializer(serializers.Serializer):
    tournament_pic = serializers.ImageField(required=False)
    name = serializers.CharField()
    # permission = serializers.CharField(default=TournamentModel.Permission.PUBLIC)


class CreateTournamentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = TournamentPicUploadSerializer(data=request.data)
        if request.user.tournament_alias is None:
            return Response({"message": "You must set a tournament alias to create a tournament"}, status=status.HTTP_400_BAD_REQUEST)
        if serializer.is_valid():
            name = serializer.validated_data['name']
            # permission = serializer.validated_data['permission']
            if name is None:
                return Response({"error": "Name is required"}, status=status.HTTP_400_BAD_REQUEST)
            tournament_pic_path = None
            if serializer.validated_data.get('tournament_pic', None) is not None:
                tournament_pic = serializer.validated_data.get('tournament_pic')
                tournament_pic_path = f"tournament_pic/{request.user.id}_{tournament_pic.name}"
                full_path = os.path.join(settings.MEDIA_ROOT, tournament_pic_path)
                default_storage.save(full_path, ContentFile(tournament_pic.read()))
            tournament = TournamentModel.objects.create(name=name, owner=request.user.profile, picture=tournament_pic_path)
            tournament.players.add(request.user.profile)
            return Response({
                "message": "Tournament created successfully",
                "tournament_id": tournament.id
            }, status=status.HTTP_200_OK)
        return Response({"message": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)
    

class JoinTournamentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        tournament_id = request.data.get('tournament_id')
        if tournament_id is None:
            return Response({"message": "Tournament ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            if request.user.tournament_alias is None:
                return Response({"message": "You must set a tournament alias to join a tournament"}, status=status.HTTP_400_BAD_REQUEST)
            tournament = TournamentModel.objects.get(id=tournament_id)
            if tournament.players.filter(id=request.user.profile.id).exists():
                return Response({"message": "You are already in this tournament"}, status=status.HTTP_200_OK)
            if tournament.invites.filter(user=request.user.profile).exists() :
                if tournament.players.count() >= 4:
                    return Response({"message": "Tournament is full"}, status=status.HTTP_400_BAD_REQUEST)
                tournament.players.add(request.user.profile)
                return Response({"message": "Tournament joined successfully",
                                "tournament": TournamentSerializer(tournament, context={'request': request}).data
                                }, status=status.HTTP_200_OK)
            else:
                return Response({"message": "You are not invited to this tournament"}, status=status.HTTP_400_BAD_REQUEST)
        except TournamentModel.DoesNotExist:
            return Response({"message": "Tournament not found"}, status=status.HTTP_404_NOT_FOUND)
        
class GetTournamentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, tournament_id):
        tournament = TournamentModel.objects.get(id=tournament_id)
        return Response(TournamentSerializer(tournament, context={'request': request}).data, status=status.HTTP_200_OK)
    
class SetTournamentAliasView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        alias = request.data.get('alias')
        if alias is None or alias == '':
            return Response({"message": "Alias is required"}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(tournament_alias=alias).exists() and request.user.tournament_alias != alias:
            return Response({"message": "Alias is already taken"}, status=status.HTTP_400_BAD_REQUEST)
        request.user.tournament_alias = alias
        request.user.save()
        return Response({"message": "Tournament alias set successfully"}, status=status.HTTP_200_OK)
    


class TournamentPicUploadSerializer(serializers.Serializer):
    tournament_pic = serializers.ImageField()

class UploadTournamentPicView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    serializer_class = TournamentPicUploadSerializer

    def post(self, request):
        serializer = TournamentPicUploadSerializer(data=request.data)
        if serializer.is_valid():
            profile_pic = serializer.validated_data['tournament_pic']
            
            tournament_pic_path = f"tournament_pics/{request.user.id}_{profile_pic.name}"
            full_path = os.path.join(settings.MEDIA_ROOT, tournament_pic_path)
            default_storage.save(full_path, ContentFile(profile_pic.read()))

            tournament_pic = TournamentPic.objects.create(picture=tournament_pic_path)
            tournament_pic.user_id = request.user
            tournament_pic.save()
            return Response({"message": "Tournament picture uploaded successfully",
                              "picture_id": tournament_pic.id,
                              "tournament_pic_url": request.build_absolute_uri(settings.MEDIA_URL + tournament_pic_path)})
        return Response(serializer.errors, status=400)
    
class UpdateTournamentPicView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            tournament_id = request.data.get('tournament_id')
            tournament_pic_id = request.data.get('tournament_pic_id')
            tournament_pic = TournamentPic.objects.get(id=tournament_pic_id)
            print(tournament_pic.user_id.id, request.user.id, flush=True)
            if tournament_pic.user_id.id != request.user.id:
                return Response({'error': 'You are not the owner of this tournament 1 '}, status=403)
            tournament = TournamentModel.objects.get(id=tournament_id)
            if tournament is None:
                return Response({'error': 'Tournament not found'}, status=404)
            if tournament.owner != request.user.profile:
                return Response({'error': 'You are not the owner of this tournament2 '}, status=403)
            tournament_pic.tournament_id = tournament_id
            tournament_pic.save()
            return Response({"message": "Tournament picture updated successfully"}, status=200)
        except TournamentPic.DoesNotExist:
            return Response({'error': 'Tournament picture not found'}, status=404)
        except TournamentModel.DoesNotExist:
            return Response({'error': 'Tournament not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=400)