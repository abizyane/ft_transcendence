from rest_framework import generics, authentication
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.pagination import PageNumberPagination
from .models import Message
from astropong.models.UserModel import User, Relationship
from .serializers import ConversationSerializer, ChatRoomSerializer, UserSerializer

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

    def get_queryset(self, current_user):
        try:
            user = User.objects.get(username=current_user)
        except User.DoesNotExist:
            raise NotFound("User not found.")
        return Message.objects.filter(Q(sender=user) | Q(receiver=user)).order_by('-timestamp')
    
    # queryset = get_queryset
    def list(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response({'error': 'You must be authenticated to access this resource.'}, status=401)
        current_user = request.user.username
        super().queryset = self.get_queryset(current_user)

        return super().list(request, *args, **kwargs)
 

class ChatRoomView(generics.ListAPIView):
    serializer_class = ChatRoomSerializer
    pagination_class = MessagesPageNumberPagination

    # authentication_classes = [authentication.TokenAuthentication]
    # permission_classes = [IsAuthenticated]

    def get_queryset(self, current_user):
        other_user = self.kwargs['username']
        try:
            currentuser = User.objects.get(username=current_user)
            otheruser = User.objects.get(username=other_user)
        except User.DoesNotExist:
            raise NotFound("User not found.")

        if not Relationship.objects.filter(Q(user1=currentuser, user2=otheruser) | Q(user1=otheruser, user2=currentuser), status = Relationship.Status.BLOCKED).not_exists():
            raise NotFound("These users are not friends.")

        return Message.objects.filter(Q(sender=currentuser, receiver=otheruser) | Q(sender=otheruser, receiver=currentuser)).order_by('timestamp')

    # queryset = get_queryset

    def list(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response({'error': 'You must be authenticated to access this resource.'}, status=401)
        current_user = request.user.username
        super().queryset = self.get_queryset(current_user)

        return super().list(request, *args, **kwargs)
    #     queryset = self.get_queryset()
    #     paginated_response = self.paginate_queryset(queryset)
    #     if not paginated_response:
    #         return NotFound("No messages found between the specified users.")
    #     serializer = ChatRoomSerializer({'l_user': paginated_response[0].sender, 'r_user': paginated_response[0].receiver, 'messages': paginated_response})
    #     return Response({
    #         'chatroom': serializer.data,
    #         'next': self.get_paginated_response(paginated_response).data.get('next'),
    #         'previous': self.get_paginated_response(paginated_response).data.get('previous')
    #     })

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