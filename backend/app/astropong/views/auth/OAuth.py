from rest_framework.views import APIView
from django.http import HttpResponseRedirect
from urllib.parse import urlencode
from rest_framework.response import Response
import requests
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from ...serializers.UserSerializer import UserSerializer
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
User = get_user_model()

@permission_classes([AllowAny])
class OAuth(APIView):
    AUTH_URL = "https://api.intra.42.fr/oauth/authorize"
    TOKEN_URL = "https://api.intra.42.fr/oauth/token"
    REDIRECT_URI = "http://localhost:3000/auth/oauth"
    CLIENT_ID = "u-s4t2ud-e86add016b6a41e208d53d0c011abdc53a93f6e1ba65ba9605a37be5a8997a17"
    CLIENT_SECRET="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"
    def get(self, request, *args, **kwargs):
        payload = {
            'client_id': self.CLIENT_ID,
            'redirect_uri': self.REDIRECT_URI,
            'response_type': 'code',
            'scope': 'public',
        }
        query_params = urlencode(payload)
        return HttpResponseRedirect(f"{self.AUTH_URL}?{query_params}")

@permission_classes([AllowAny])
class OAuthCallback(APIView):
    def getUserInfo(self,access_token):
        return None

    def getToken(self,code):
        payload = {
            'grant_type': 'authorization_code',
            'client_id': OAuth.CLIENT_ID,
            'client_secret': OAuth.CLIENT_SECRET,
            'code': code,
            "redirect_uri": OAuth.REDIRECT_URI
        }
        response = requests.post(OAuth.TOKEN_URL, data=payload)
        if response.status_code != 200:
            return Response("Invalid request", status=status.HTTP_401_UNAUTHORIZED)
        resp = response.json()
        access_token = resp['access_token']
        return self.getUser(access_token, code)
    
    def is_email_existing(self, email):
        return User.objects.filter(email=email).exists()

    def createUserInfo(self, user, code):
        try:
            serializer = UserSerializer(data={
                'email': user['email'],
                'username': user['login'],
                'first_name': user['first_name'],
                'last_name': user['last_name'],
                'profile_pic': user['image']['versions']['small'],
                'password' : code
            })
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return self.loginUser(serializer.instance, self.request)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)
    
    def loginUser(self, user_instance, request):
        refresh = RefreshToken.for_user(user_instance)
        user_data = UserSerializer(user_instance, context={'request': self.request}).data
        
        response = Response(user_data)
        
        response.set_cookie(key='refresh', value=str(refresh),samesite='None', httponly=True, secure=True)
        response.set_cookie(key='access', value=str(refresh.access_token),samesite='None', httponly=True, secure=True)
        response.set_cookie(key='isLoggedIn', value=str(True), httponly=False, secure=True)
        if user_instance.mfa_enabled:
            response.status_code = 403
            request.session['2fa_verified'] = False
        return response

    def getUser(self, access_token, code):
        resp = requests.get("https://api.intra.42.fr/v2/me"
                            , headers={'Authorization': f"Bearer {access_token}"})
        if resp.status_code == 200:
            user = resp.json()
            if self.is_email_existing(user['email']):
                user = User.objects.filter(email=user['email']).get()
                return self.loginUser(user, self.request)
            else:
                return self.createUserInfo(user, code)    
        else:
            return Response({'error': "An error has occured"}, status=status.HTTP_401_UNAUTHORIZED)
        

    def get(self, request, *args, **kwargs):
        code = request.GET.get('code')
        if code:
            return self.getToken(code)
        else:
            return Response("Invalid request", status=status.HTTP_401_UNAUTHORIZED)