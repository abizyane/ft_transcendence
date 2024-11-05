from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model

User = get_user_model()

class AddFriendView(APIView):
    def post(self, request):
        friendId = request.data.get('friend_id')
        try:
            friend = User.objects.get(id=friendId)
        except User.DoesNotExist:
            return Response({
                "error": "User not found"
            }, status=404)
        user = request.user
        return Response("Add friend")