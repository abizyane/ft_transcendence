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
        
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        user = request.user
        new_password = request.data.get('new_password')
        if new_password is None:
            return Response({'error': 'New password is required'}, status=400)
        elif len(new_password) < 8:
            return Response({'error': 'Password must be at least 8 characters long'}, status=400)
        elif new_password == request.user.username:
            return Response({'error': 'Password cannot be the same as username'}, status=400)
        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password changed successfully'}, status=200)

class UserIdView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        iduser = request.data.get('id')
        if iduser is None:
            return Response({'error': 'IdUser is required'}, status=400)
        try:
            user = User.objects.filter(id=iduser).first()
            return Response(UserSerializer(user, context={'request': request,}).data)
        except User.DoesNotExist:
            return Response({'error': 'User doesnt exist'}, status=404)

class UsersView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        username = request.data.get('username')
        if username is None:
            return Response({'error': 'Username is required'}, status=400)
        try:
            users = User.objects.filter(username__icontains=username)
            return Response(UserSerializer(users, many=True, context={'request': request,}).data)
        except User.DoesNotExist:
            return Response([], status=200)
        