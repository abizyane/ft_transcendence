import jwt
from django.conf import settings
from .models.UserModel import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

class JWTAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # token = request.COOKIES.get('jwt') or request.headers.get('Authorization')
        token = request.headers.get('Authorization')
        if token and token.startswith("Bearer "):
            token = token.split("Bearer ")[1]
        if token:
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                user_id = payload.get('id')
                
                user = User.objects.get(id=user_id)
                request.user = user
            except jwt.ExpiredSignatureError:
                return JsonResponse({'error': 'Token expired'}, status=401)
            except jwt.InvalidTokenError:
                return JsonResponse({'error': 'Invalid token'}, status=401)
            except User.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)
        else:
            request.user = None

        response = self.get_response(request)
        return response