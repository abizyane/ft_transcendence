from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import IsAuthenticated
from ...serializers.UserSerializer import UserSerializer
from ...models.UserModel import User
import jwt, datetime

class LoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        user = User.objects.filter(email=email).first()
        if user is None :
            raise AuthenticationFailed("User not found !")
        if not user.check_password(password):
            raise AuthenticationFailed("Password is incorrect !")
        
        payload = {
            'id':user.id,
            'expire_at': (datetime.datetime.now() + datetime.timedelta(minutes=60)).strftime("%Y-%m-%d %H:%M:%S"),
            'created_at':datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        response = Response()
        token = jwt.encode(payload, "SECRET_KEY", algorithm='HS256')
        response.data = {
            'jwt':token
        }
        response.set_cookie(key='jwt', value=token, httponly=True)
        return response