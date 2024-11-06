from django.core.exceptions import ValidationError
from django.db import models
from ...models.UserModel import Relationship
from ...serializers.UserSerializer import FriendSerializer
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework import status


User = get_user_model()

class AddFriendView(APIView):
    def post(self, request):
        friendId = request.data.get('friend_id')
        if friendId is None:
            return Response({"error": "Friend id is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            friend = User.objects.get(id=friendId)
            try:
                request.user.add_friend(friend)
                return Response({"message": "Friend added successfully."}, status=status.HTTP_200_OK)
            except ValidationError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        except User.DoesNotExist:
            return Response({
                "error": "User not found"
            }, status=404)
    
class ListFriendView(APIView):
    def get(self, request):
        try:
            user = request.user
            relations = Relationship.objects.filter((models.Q(user1=user) | models.Q(user2=user)) & models.Q(status=Relationship.Status.FRIEND))
            friends = []
            for relation in relations:
                if relation.user1 == user:
                    friends.append(relation.user2)
                else:
                    friends.append(relation.user1)
            serializer = FriendSerializer(friends, many=True, context={'request': request})
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({
                "error": "User not found"
            }, status=404)