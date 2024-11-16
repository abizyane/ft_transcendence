from django.utils.deprecation import MiddlewareMixin
from django.conf import settings
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.contrib.auth.models import AnonymousUser
import requests
from django.core.cache import cache
from django.contrib.auth import get_user_model

User = get_user_model()
class JWTAuthenticationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        access_token = request.COOKIES.get('access')
        refresh_token = request.COOKIES.get('refresh')

        if access_token:
            try:
                token = AccessToken(access_token)
                user_id = token.get('user_id')

                cached_user = cache.get(f"user_{user_id}")
                if cached_user:
                    request.user = cached_user
                else:
                    user = User.objects.get(id=user_id)
                    cache.set(f"user_{user_id}", user, timeout=300)  # Cache for 5 minutes
                    request.user = user
                return
            except (TokenError, User.DoesNotExist):
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
