from django.utils.deprecation import MiddlewareMixin
from django.conf import settings
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth.models import AnonymousUser
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model

User = get_user_model()

@database_sync_to_async
def get_user_from_token(token):
    try:
        access_token = AccessToken(token)
        user_id = access_token['user_id']
        return User.objects.get(id=user_id)
    except (TokenError, User.DoesNotExist):
        return AnonymousUser()

class JWTAuthWebSocketMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        cookies = dict(scope['headers'])
        access_token = None
        refresh_token = None

        for header in cookies:
            if header[0] == b'cookie':
                cookie_str = header[1].decode()
                cookies = dict(item.split("=") for item in cookie_str.split("; "))
                access_token = cookies.get('access')
                refresh_token = cookies.get('refresh')

        if access_token:
            user = await get_user_from_token(access_token)
            if user.is_authenticated:
                scope['user'] = user
            else:
                if refresh_token:
                    try:
                        new_access_token = str(RefreshToken(refresh_token).access_token)
                        user = await get_user_from_token(new_access_token)
                        if user.is_authenticated:
                            scope['user'] = user
                    except TokenError:
                        scope['user'] = AnonymousUser()
                else:
                    scope['user'] = AnonymousUser()
        else:
            scope['user'] = AnonymousUser()

        return await super().__call__(scope, receive, send)