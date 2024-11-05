# middleware.py
from django.utils.deprecation import MiddlewareMixin
from django.conf import settings
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.contrib.auth.models import AnonymousUser
import requests
class JWTAuthenticationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        access_token = request.COOKIES.get('access')
        refresh_token = request.COOKIES.get('refresh')

        if access_token:
            try:
                AccessToken(access_token)
                request.META['HTTP_AUTHORIZATION'] = f'Bearer {access_token}'
                return
            except TokenError:
                pass 

        if refresh_token:
            try:
                new_access_token = str(RefreshToken(refresh_token).access_token)
                
                request.META['HTTP_AUTHORIZATION'] = f'Bearer {new_access_token}'
                
                request.COOKIES['access'] = new_access_token

            except TokenError:
                request.user = AnonymousUser()
        else:
            request.user = AnonymousUser()
