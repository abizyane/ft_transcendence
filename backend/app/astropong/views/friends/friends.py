import secrets
from django.core.exceptions import ValidationError
from django.db import models

from notification.models import Notifications
from game.models import GameInvite
from ...models.UserModel import Relationship
from ...serializers.UserSerializer import FriendSerializer, UserSerializer
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from channels.layers import get_channel_layer
from chat.serializers import UserSerializer as MinUserSerializer
from rest_framework import generics
from rest_framework.exceptions import NotAuthenticated, NotFound
from asgiref.sync import async_to_sync

User = get_user_model()


class AddFriendView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        friendId = request.data.get('friend_id')
        if friendId is None:
            return Response({"error": "Friend id is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            if (request.user.id == friendId):
                return Response({"error": "You cannot add yourself as a friend."}, status=status.HTTP_400_BAD_REQUEST)
            friend = User.objects.get(id=friendId)
            try:
                request.user.add_friend(friend)
                return Response({"message": "Friend request sent successfully."}, status=status.HTTP_200_OK)
            except ValidationError as e:
                return Response({"error": e}, status=status.HTTP_400_BAD_REQUEST)
        
        except User.DoesNotExist:
            return Response({
                "error": "User not found"
            }, status=404)

class RemoveFriendView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        friendId = request.data.get('friend_id')
        if friendId is None:
            return Response({"error": "Friend id is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            friend = User.objects.get(id=friendId)
            try:
                request.user.remove_friend(friend)
                return Response({"message": "Friend removed."}, status=status.HTTP_200_OK)
            except ValidationError as e:
                return Response({"error": e}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({
                "error": "User not found"
            }, status=404)

class AcceptFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        friendId = request.data.get('friend_id')
        if friendId is None:
            return Response({"error": "Friend id is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            friend = User.objects.get(id=friendId)
            try:
                request.user.accept_friend_request(friend)
                return Response({"message": "Friend request accepted."}, status=status.HTTP_200_OK)
            except ValidationError as e:
                return Response({"error": e}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({
                "error": "User not found"
            }, status=404)
class RejectFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        friendId = request.data.get('friend_id')
        if friendId is None:
            return Response({"error": "Friend id is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            friend = User.objects.get(id=friendId)
            try:
                request.user.refuse_friend_request(friend)
                return Response({"message": "Friend request rejected."}, status=status.HTTP_200_OK)
            except ValidationError as e:
                return Response({"error": e}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({
                "error": "User not found"
            }, status=404)
        
class BlockFriendView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        friendId = request.data.get('user_id')
        if friendId is None:
            return Response({"error": "User id is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            if (request.user.id == friendId):
                return Response({"error": "You cannot block yourself."}, status=status.HTTP_400_BAD_REQUEST)
            friend = User.objects.get(id=friendId)
            try:
                request.user.block_friend(friend)
                return Response({"message": "User blocked."}, status=status.HTTP_200_OK)
            except ValidationError as e:
                return Response({"error": e}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({
                "error": "User not found"
            }, status=404)
        
class UnblockFriendView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        friendId = request.data.get('user_id')
        if friendId is None:
            return Response({"error": "User id is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            friend = User.objects.get(id=friendId)
            try:
                request.user.unblock_friend(friend)
                return Response({"message": "User unblocked."}, status=status.HTTP_200_OK)
            except ValidationError as e:
                return Response({"error": e}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({
                "error": "User not found"
            }, status=404)


class BlockedUsersList(generics.ListAPIView):
    
    permission_classes = [IsAuthenticated]
    serializer_class = MinUserSerializer

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            raise NotAuthenticated("You must be authenticated to access this resource.")
        try:
            user = User.objects.get(username=self.request.user.username)
        except User.DoesNotExist:
            raise NotFound("User not found.")
        
        relations = Relationship.objects.filter((models.Q(user1=user) | models.Q(user2=user)) & models.Q(userWhoBlocked=user), status=Relationship.Status.BLOCKED)
        blocked_users = [relation.user2 if relation.user1 == user else relation.user1 for relation in relations]
    
        return blocked_users
    
class FriendsOfView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            relations = Relationship.objects.filter(
                (models.Q(user1=user) | models.Q(user2=user)) &
                (models.Q(status=Relationship.Status.FRIEND))
            )
            friends_with_relationship = []
            for relation in relations:
                friend = relation.user2 if relation.user1 == user else relation.user1
                if friend == user:
                    pass
                friends_with_relationship.append((friend, relation)) 

            serializer = FriendSerializer(
                [friend for friend, _ in friends_with_relationship],
                many=True,
                context={'request': request, 'relationships': friends_with_relationship}
            )
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({
                "error": "User not found"
            }, status=404)
    
class ListFriendView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, relationship_type=None):
        user = request.user
        friends_with_relationship = []
        
        if relationship_type == 'friends':
            relations = Relationship.objects.filter(
                (models.Q(user1=user) | models.Q(user2=user)) &
                models.Q(status=Relationship.Status.FRIEND)
            )
        elif relationship_type == 'friend_requests':
            relations = Relationship.objects.filter(
                (models.Q(user2=user) | models.Q(user1=user)) &
                models.Q(status=Relationship.Status.FRIENDREQUEST)
            )
        else: 
            relations = Relationship.objects.filter(
                (models.Q(user1=user) | models.Q(user2=user)) &
                (models.Q(status=Relationship.Status.FRIEND) | models.Q(status=Relationship.Status.FRIENDREQUEST))
            )

        for relation in relations:
            friend = relation.user2 if relation.user1 == user else relation.user1
            if friend == user:
                pass
            friends_with_relationship.append((friend, relation)) 

        serializer = FriendSerializer(
            [friend for friend, _ in friends_with_relationship],
            many=True,
            context={'request': request, 'relationships': friends_with_relationship}
        )
        return Response(serializer.data)


class InviteFriendView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        friendId = request.data.get('friend_id')
        if friendId is None:
            return Response({"error": "Friend id is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            friend = User.objects.get(id=friendId)
            if friend == user:
                return Response({"error": "You cannot invite yourself to a game."}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            relations = Relationship.objects.filter(
                ((models.Q(user1=user) & models.Q(user2=friend)) |
                (models.Q(user1=friend) & models.Q(user2=user))) &
                models.Q(status=Relationship.Status.FRIEND)
            )
            if not relations.exists():
                return Response({"error": "You must be friends with this user to invite them to a game."}, status=status.HTTP_400_BAD_REQUEST)
            token = secrets.token_urlsafe(32)
            GameInvite.objects.create(user_created=user, user_invited=friend, token=token, status=GameInvite.Status.PENDING)
            
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                "notifications",
                {
                    'type': 'notification',
                    'receiver': friend.username,
                    'notification_type': "game_invite",
                    'content': f"{user.username} invited you to a game",
                    'link': f"/game/solo/maps?game=randommatch&token={token}"
                }
            )
            return Response({
                "message": "Friend invited.",
                "token": token
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)