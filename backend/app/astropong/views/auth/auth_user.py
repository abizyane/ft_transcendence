from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import IsAuthenticated
from ...serializers.UserSerializer import UserSerializer
from ...models.UserModel import User
import jwt, datetime

class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user and request.user.is_authenticated:
            return Response(UserSerializer(request.user).data)
        else:
            return Response({'error': 'No user is connected'}, status=401)