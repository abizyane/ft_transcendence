from rest_framework.views import APIView
from django.http import HttpResponseRedirect
from urllib.parse import urlencode
from rest_framework.response import Response
import requests
class OAuth(APIView):
    AUTH_URL = "https://api.intra.42.fr/oauth/authorize"
    TOKEN_URL = "https://api.intra.42.fr/oauth/token"
    REDIRECT_URI = "http://localhost:3000/auth/OAuth"
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
class OAuthCallback(APIView):
    def getToken(self,code):
        payload = {
            'grant_type': 'client_credentials',
            'client_id': OAuth.CLIENT_ID,
            'client_secret': OAuth.CLIENT_SECRET,
            'code': code,
        }
        response = requests.post(OAuth.TOKEN_URL, data=payload)
        print(response.json())
        return response.json()
    def get(self, request, *args, **kwargs):
        return Response("Hello World")