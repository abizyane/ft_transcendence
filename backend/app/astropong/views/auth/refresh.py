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
class RefreshTokenView(APIView):
    def get(self, request):
        refresh_token = request.COOKIES.get("jwt")
        if not refresh_token:
            return Response("No token", status=status.HTTP_401_UNAUTHORIZED)
        try:
            refresh = RefreshToken(refresh_token)
            new_access_token = refresh.access_token
            return Response({"access": str(new_access_token)}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

