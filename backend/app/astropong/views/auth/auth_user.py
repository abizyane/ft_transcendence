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
            return Response(UserSerializer(request.user, context={'request': request}).data)
        else:
            return Response({'error': 'No user is connected'}, status=401)

class UsersView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        username = request.data.get('username')
        if username is None:
            return Response({'error': 'Username is required'}, status=400)
        try:
            users = User.objects.filter(username__icontains=username)
            return Response(UserSerializer(users, many=True).data)
        except User.DoesNotExist:
            return Response([], status=200)
        