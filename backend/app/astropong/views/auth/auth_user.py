from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import IsAuthenticated
from ...serializers.UserSerializer import FriendSerializer, UserSerializer
from ...models.UserModel import User, Relationship
import jwt, datetime
from django.http import HttpResponse
from django.conf import settings
from rest_framework import serializers
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.db import models
import os
from rest_framework.parsers import MultiPartParser, FormParser
import pyotp
import io
import qrcode
import re

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
            try:
                relation = Relationship.objects.filter(
                    (models.Q(user1=request.user.id) & models.Q(user2=iduser)) | (models.Q(user1=iduser) & models.Q(user2=request.user.id))
                ).first()
                if relation is not None:
                    if relation.status == Relationship.Status.BLOCKED:
                        return Response({'error': 'You cannot see this user'}, status=403)
            except Relationship.DoesNotExist:
                pass
            user = User.objects.filter(id=iduser).first()

            query = models.Q(user1=user, user2=request.user) | models.Q(user1=request.user, user2=user)

            relation = Relationship.objects.filter(query).first()

            # if not relation:
            #     relation = Relationship.objects.create(
            #         user1=user,
            #         user2=request.user,
            #         status=Relationship.Status.UNKNOWN
            #     )
            return Response(FriendSerializer(user, context={'request': request, 'relationships': relation}).data)
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
        
class MFAView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        otp_uri = pyotp.totp.TOTP(request.user.mfa_secret).provisioning_uri(request.user.email, issuer_name="AstroPong")
        qr = qrcode.make(otp_uri)
        buffer = io.BytesIO()
        qr.save(buffer, format="PNG")
        buffer.seek(0)
        return HttpResponse(buffer, content_type='image/png')
    def post(self,request):
        user = request.user
        otp = request.data.get('otp')
        if otp is None:
            return Response({'error': 'OTP is required'}, status=400)
        if user.verify_otp(otp):
            request.session['2fa_verified'] = True
            return Response({'message': 'MFA enabled successfully'}, status=200)
        else:
            return Response({'error': 'Invalid OTP'}, status=400)
    def delete(self,request):
        user = request.user
        if not user.mfa_enabled:
            return Response({'error': 'MFA is already disabled'}, status=400)
        user.mfa_enabled = False
        request.session['2fa_verified'] = False
        print("session", request.session['2fa_verified'], flush=True)
        user.save()
        return Response({'message': 'MFA disabled successfully'}, status=200)
    
class GameCustomizationView(APIView):
    permission_classes = [IsAuthenticated]

    def validate_color(self, color):
        if not re.match(r'^[0-9]+,[0-9]+,[0-9]+$', color):
            return False
        return True
    
    def get(self, request):
        user = request.user
        return Response({
            'user_paddle_color': user.profile.user_paddle_color,
            'opponent_paddle_color': user.profile.opponent_paddle_color,
            'ball_color': user.profile.ball_color
        }, status=200)
    def post(self, request):
        user = request.user
        user_paddle_color = request.data.get('user_paddle_color')
        opponent_paddle_color = request.data.get('opponent_paddle_color')
        ball_color = request.data.get('ball_color')
        if not user_paddle_color or not opponent_paddle_color or not ball_color:
            return Response({'error': 'All fields are required'}, status=400)
        if not self.validate_color(user_paddle_color):
            return Response({'error': 'Invalid user paddle color'}, status=400)
        if not self.validate_color(opponent_paddle_color):
            return Response({'error': 'Invalid opponent paddle color'}, status=400)
        if not self.validate_color(ball_color):
            return Response({'error': 'Invalid ball color'}, status=400)
        user.profile.user_paddle_color = user_paddle_color
        user.profile.opponent_paddle_color = opponent_paddle_color
        user.profile.ball_color = ball_color
        user.profile.save()
        return Response({'message': 'Game customization updated successfully'}, status=200)
        