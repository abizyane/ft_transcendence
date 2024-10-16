from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework import generics
from ...serializers.UserSerializer import UserSerializer
User = get_user_model()

@permission_classes([AllowAny])
class LoginView(APIView):
    def post(self, request):
        permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = User.objects.filter(email=email).first()
        if user is None:
            raise AuthenticationFailed("User not found!")
        
        if not user.check_password(password):
            raise AuthenticationFailed("Password is incorrect!")

        refresh = RefreshToken.for_user(user)
        response = Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })

        response.set_cookie(key='jwt', value=str(refresh.access_token), httponly=True)

        return response
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()  # Fetch all users
    serializer_class = UserSerializer  # Specify the serializer class to use
