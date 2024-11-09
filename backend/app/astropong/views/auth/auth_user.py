from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import IsAuthenticated
from ...serializers.UserSerializer import UserSerializer
from ...models.UserModel import User
import jwt, datetime
from django.conf import settings
from rest_framework import serializers
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os
from rest_framework.parsers import MultiPartParser, FormParser


class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user and request.user.is_authenticated:
            return Response(UserSerializer(request.user, context={'request': request}).data)
        else:
            return Response({'error': 'No user is connected'}, status=401)
        
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        user = request.user
        new_password = request.data.get('new_password')
        if new_password is None:
            return Response({'error': 'New password is required'}, status=400)
        elif len(new_password) < 8:
            return Response({'error': 'Password must be at least 8 characters long'}, status=400)
        elif new_password == request.user.username:
            return Response({'error': 'Password cannot be the same as username'}, status=400)
        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password changed successfully'}, status=200)

class UserIdView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        iduser = request.data.get('id')
        if iduser is None:
            return Response({'error': 'IdUser is required'}, status=400)
        try:
            user = User.objects.filter(id=iduser).first()
            return Response(UserSerializer(user, context={'request': request,}).data)
        except User.DoesNotExist:
            return Response({'error': 'User doesnt exist'}, status=404)

class ProfilePicUploadSerializer(serializers.Serializer):
    profile_pic = serializers.ImageField()

class UploadProfilePicView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    serializer_class = ProfilePicUploadSerializer

    def post(self, request):
        serializer = ProfilePicUploadSerializer(data=request.data)
        if serializer.is_valid():
            profile_pic = serializer.validated_data['profile_pic']
            
            profile_pic_path = f"profile_pics/{request.user.id}_{profile_pic.name}"
            full_path = os.path.join(settings.MEDIA_ROOT, profile_pic_path)
            default_storage.save(full_path, ContentFile(profile_pic.read()))

            request.user.profile_pic = profile_pic_path
            request.user.save()

            return Response({"message": "Profile picture uploaded successfully", "profile_pic_url": request.build_absolute_uri(settings.MEDIA_URL + profile_pic_path)})
        return Response(serializer.errors, status=400)
class UsersView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        username = request.data.get('username')
        if username is None:
            return Response({'error': 'Username is required'}, status=400)
        try:
            users = User.objects.filter(username__icontains=username)
            return Response(UserSerializer(users, many=True, context={'request': request,}).data)
        except User.DoesNotExist:
            return Response([], status=200)
        