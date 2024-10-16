from rest_framework.views import APIView
from rest_framework.response import Response
from ...serializers.UserSerializer import UserSerializer
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes

@permission_classes([AllowAny])
class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
