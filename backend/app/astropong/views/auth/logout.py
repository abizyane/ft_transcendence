from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from ...serializers.UserSerializer import UserSerializer
from ...models.UserModel import User
import jwt, datetime

class LogoutView(APIView):
    def post(self, request):
        try:
            user = request.user
            dbuser = User.objects.get(id=user.id)
            dbuser.is_online = False
            dbuser.save()
        except:
            pass
        response = Response()
        response.delete_cookie('access')
        response.delete_cookie('refresh')
        response.delete_cookie('isLoggedIn')
        response.data = {
            'message': 'success'
        }
        return response