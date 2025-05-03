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
from django.contrib.auth import login
User = get_user_model()

@permission_classes([AllowAny])
class LoginView(APIView):

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        otp = request.data.get('otp')

        user = User.objects.filter(email=email).first()
        
        if user is None:
            raise AuthenticationFailed("User not found!")
        
        if not user.check_password(password):
            raise AuthenticationFailed("Password is incorrect!")
        
        refresh = RefreshToken.for_user(user)
        user_data = UserSerializer(user, context={'request': request}).data
        response = Response(user_data)
        response.set_cookie(key='refresh', value=str(refresh), httponly=True)
        response.set_cookie(key='access', value=str(refresh.access_token), httponly=True)
        response.set_cookie(key='isLoggedIn', value=str(True), httponly=False)
        if user.mfa_enabled:
            response.status_code = 403
            request.session['2fa_verified'] = False

        return response
    
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()  
    serializer_class = UserSerializer  
