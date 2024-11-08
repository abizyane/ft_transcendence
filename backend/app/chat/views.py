from rest_framework import generics, authentication
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from rest_framework.response import Response
from rest_framework.exceptions import NotAuthenticated
from rest_framework.exceptions import NotFound
from rest_framework.pagination import PageNumberPagination
from .models import Message
from astropong.models.UserModel import User, Relationship
from .serializers import ConversationSerializer, ChatRoomSerializer, UserSerializer
from itertools import groupby

class ConversationsPageNumberPagination(PageNumberPagination):
    page_size = 7

class MessagesPageNumberPagination(PageNumberPagination):
    page_size = 5

class ConversationsView(generics.ListAPIView):
    # queryset = Message.objects.order_by('-timestamp')
    serializer_class = ConversationSerializer
    pagination_class = ConversationsPageNumberPagination

    # authentication_classes = [authentication.TokenAuthentication]
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            raise NotAuthenticated("You must be authenticated to access this resource.")
        try:
            current_user = self.request.user.username
            user = User.objects.get(username=current_user)
        except User.DoesNotExist:
            raise NotFound("User not found.")
        
        messages = Message.objects.filter(Q(sender=user) | Q(receiver=user)).order_by('-timestamp')

        latest_messages = []
        for message in messages:
            user_pair = tuple(sorted([message.sender_id, message.receiver_id]))
            if user_pair not in latest_messages:
                latest_messages[user_pair] = message

        return sorted(latest_messages.values(), key=lambda x: x.timestamp, reverse=True)

    # def list(self, request, *args, **kwargs):
    #     if not request.user.is_authenticated:
    #         return Response({'error': 'You must be authenticated to access this resource.'}, status=401)
    #     current_user = request.user.username
    #     super().queryset = self.get_queryset(current_user)

    #     return super().list(request, *args, **kwargs)
 

class ChatRoomView(generics.ListAPIView):
    serializer_class = ChatRoomSerializer
    pagination_class = MessagesPageNumberPagination

    # authentication_classes = [authentication.TokenAuthentication]
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        other_user = self.kwargs['username']
        if not self.request.user.is_authenticated:
            raise NotAuthenticated("You must be authenticated to access this resource.")
        try:
            current_user = self.request.user.username
            currentuser = User.objects.get(username=current_user)
            otheruser = User.objects.get(username=other_user)
        except User.DoesNotExist:
            raise NotFound("User not found.")

        if Relationship.objects.filter(Q(user1=currentuser, user2=otheruser) | Q(user1=otheruser, user2=currentuser), status = Relationship.Status.BLOCKED).exists():
            raise NotFound("These users are blocked.")

        return Message.objects.filter(Q(sender=currentuser, receiver=otheruser) | Q(sender=otheruser, receiver=currentuser)).order_by('-timestamp')


    # def list(self, request, *args, **kwargs):
    #     if not request.user.is_authenticated:
    #         return Response({'error': 'You must be authenticated to access this resource.'}, status=401)
    #     current_user = request.user.username
    #     super().queryset = self.get_queryset(current_user)

    #     return super().list(request, *args, **kwargs)

class OnlineUsersPageNumberPagination(PageNumberPagination):
    page_size = 5

class OnlineUsersView(generics.ListAPIView):
    queryset = User.objects.filter(is_online=True)
    serializer_class = UserSerializer
    pagination_class = OnlineUsersPageNumberPagination

    # authentication_classes = [authentication.TokenAuthentication]
    # permission_classes = [IsAuthenticated]
    def list(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response({'error': 'You must be authenticated to access this resource.'}, status=401)
        return super().list(request, *args, **kwargs)