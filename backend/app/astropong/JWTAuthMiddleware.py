from channels.middleware import BaseMiddleware
from rest_framework_simplejwt.tokens import AccessToken
from channels.db import database_sync_to_async
from rest_framework_simplejwt.backends import TokenBackend
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

class JWTAuthMiddleware(BaseMiddleware):
    
    async def __call__(self, scope, receive, send):
    
        token = self.get_token_from_scope(scope)

        if token != None:
            user = await self.get_user_from_token(token) 
            if user:
                print("user ", user, flush=True)
                scope['user'] = user

            else:
                scope['error'] = 'Invalid token'

        if token == None:
            scope['error'] = 'provide an auth token'    
    
                
        return await super().__call__(scope, receive, send)
    def parse_cookies(self,cookie_header):
        """
        Parse cookies from the cookie header string into a dictionary.
        """
        cookies = {}
        if cookie_header:
            cookie_pairs = cookie_header.split(';')
            for pair in cookie_pairs:
                pair = pair.strip()
                if '=' in pair:
                    key, value = pair.split('=', 1)
                    cookies[key] = value
        return cookies
    def get_token_from_scope(self, scope):
        headers = dict(scope.get("headers", []))
        
        cookie_header = headers.get(b'cookie', b'').decode('utf-8')
        
        cookies = self.parse_cookies(cookie_header)

        access_token = cookies.get('access')
        return access_token
        
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