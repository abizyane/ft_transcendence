from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from rest_framework_simplejwt.backends import TokenBackend
from rest_framework_simplejwt.tokens import AccessToken,RefreshToken
from rest_framework_simplejwt.exceptions import TokenError,TokenBackendError, InvalidToken
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
User = get_user_model()

class JWTAuthMiddleware(BaseMiddleware):
    
    async def __call__(self, scope, receive, send):
    
        token = self.get_token_from_scope(scope, "access")

        if token != None:
            try:
                user = await self.get_user_from_token(token) 
                if user:
                    scope['user'] = user
                    return await super().__call__(scope, receive, send)
            except Exception as e:
                refresh_token = self.get_token_from_scope(scope, "refresh")
                if refresh_token:
                    try:
                        new_token = RefreshToken(refresh_token)
                        user = await self.get_user_from_token(str(new_token.access_token))
                        if user:
                            scope['user'] = user
                            return await super().__call__(scope, receive, send)
                    except TokenBackendError as e:
                        scope['error'] = f"Refresh token error: {str(e)}"
                        scope['user'] = AnonymousUser()
                        
                else:
                    scope['error'] = str(e)
                    scope['user'] = AnonymousUser()
        else:
            scope['error'] = 'provide an auth token'
            scope['user'] = AnonymousUser()
                
        return await super().__call__(scope, receive, send)
    def parse_cookies(self,cookie_header):
        """
        Parse cookies from the cookie header string into a dictionary.
        """
        cookies = {}
        if not cookie_header:
            return None
        if cookie_header:
            cookie_pairs = cookie_header.split(';')
            for pair in cookie_pairs:
                pair = pair.strip()
                if '=' in pair:
                    key, value = pair.split('=', 1)
                    cookies[key] = value
        return cookies
    def get_token_from_scope(self, scope, token_type):
        headers = dict(scope.get("headers", []))
        
        cookie_header = headers.get(b'cookie', b'').decode('utf-8')
        
        cookies = self.parse_cookies(cookie_header)
        if cookies:
            token = cookies.get(token_type)
            return token
        return None
        
    @database_sync_to_async
    def get_user_from_token(self, token):
        try:
            token_backend = TokenBackend(
                algorithm=settings.SIMPLE_JWT['ALGORITHM'],
                signing_key=settings.SIMPLE_JWT['SIGNING_KEY']
            )
            decoded_payload = token_backend.decode(token, verify=True)
            
            user_id = decoded_payload.get('user_id')
            if not user_id:
                raise InvalidToken("User ID not found in token.")
            
            user_instance = User.objects.get(id=user_id)
            return user_instance
        except TokenError as e:
            raise InvalidToken(f"Token error: {e}")
        except TokenBackendError as e:
            raise TokenBackendError(f"Token backend error: {e}")
        except User.DoesNotExist:
            raise InvalidToken("User not found.")
            # try:

        #     # print("token ", token, flush=True)
        #     access_token = AccessToken(token)
        #     print("access_token", access_token['id'], flush=True)
        #     return access_token
        # except Exception as e:
        #     print("error ex ",e)
        #     return None