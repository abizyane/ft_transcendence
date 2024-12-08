from django.core.exceptions import ValidationError
from django.db import models

from astropong.serializers.TournamentSerializer import TournamentSerializer
from game.models import TournamentModel
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



class PublicTournamentView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            tournaments = TournamentModel.objects.filter(
                (models.Q(state=TournamentModel.State.SCHEDULED) & 
                models.Q(permission=TournamentModel.Permission.PUBLIC)) |
                (models.Q(state=TournamentModel.State.SCHEDULED) & 
                models.Q(permission=TournamentModel.Permission.PRIVATE) & 
                (models.Q(players=request.user.profile) | models.Q(owner=request.user.profile) | models.Q(invites=request.user.profile))
            ))
            serializer = TournamentSerializer(tournaments, context={'request': request}, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except TournamentModel.DoesNotExist:
            return Response([], status=status.HTTP_200_OK)
    
class TournamentPicUploadSerializer(serializers.Serializer):
    tournament_pic = serializers.ImageField(required=False)
    name = serializers.CharField()
    permission = serializers.CharField(default=TournamentModel.Permission.PUBLIC)


class CreateTournamentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = TournamentPicUploadSerializer(data=request.data)
        if request.user.tournament_alias is None:
            return Response({"message": "You must set a tournament alias to create a tournament"}, status=status.HTTP_400_BAD_REQUEST)
        if serializer.is_valid():
            name = serializer.validated_data['name']
            permission = serializer.validated_data['permission']
            if name is None:
                return Response({"error": "Name is required"}, status=status.HTTP_400_BAD_REQUEST)
            tournament_pic_path = None
            if serializer.validated_data.get('tournament_pic', None) is not None:
                tournament_pic = serializer.validated_data.get('tournament_pic')
                tournament_pic_path = f"tournament_pic/{request.user.id}_{tournament_pic.name}"
                full_path = os.path.join(settings.MEDIA_ROOT, tournament_pic_path)
                default_storage.save(full_path, ContentFile(tournament_pic.read()))
            tournament = TournamentModel.objects.create(name=name, permission=permission, owner=request.user.profile, picture=tournament_pic_path)
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
            if tournament.invites.filter(user=request.user.profile).exists() or tournament.permission == TournamentModel.Permission.PUBLIC:
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