from rest_framework import generics, authentication
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
    queryset = Message.objects.order_by('-timestamp')
    serializer_class = ConversationSerializer
    pagination_class = ConversationsPageNumberPagination

    # authentication_classes = [authentication.TokenAuthentication]

# class ConversationsView(views.APIView):
#     def get(self, request):
#         paginator = ConversationsPageNumberPagination()
#         messages = Message.objects.order_by('-timestamp')
#         context = paginator.paginate_queryset(messages, request)
#         serializer = ConversationSerializer(context, many=True)
#         return paginator.get_paginated_response(serializer.data)


# class MessagesView(views.APIView):
#     def get_messages(self, request, sender, receiver):
#         try:
#             sender = User.objects.get(username=sender)
#             receiver = User.objects.get(username=receiver)
#         except User.DoesNotExist:
#             raise NotFound("User not found.")

#         if not Relationship.objects.filter(Q(user1=sender, user2=receiver) | Q(user1=receiver, user2=sender), status=Relationship.Status.FRIEND).exists():
#             raise NotFound("These users are not friends.")

#         messages = Message.objects.filter(Q(sender=sender, receiver=receiver) | Q(sender=receiver, receiver=sender)).order_by('timestamp')
#         paginator = MessagesPageNumberPagination()
#         context = paginator.paginate_queryset(messages, request)
#         serializer = ConversationSerializer(context, many=True)
#         return paginator.get_paginated_response(serializer.data)

#     def get(self, request, sender, receiver):
#         try :
#             messages = self.get_messages(request, sender, receiver)
#             serializer = MessageSerializer(messages, many=True)
#             return Response({'messages': serializer.data})
#         except NotFound as e:
#             return Response({'error': str(e)}, status=404)

# class ChatRoomView(MessagesView):
#     def get(self, request, sender, receiver):
#         try:
#             paginated_response = self.get_messages(request, sender, receiver)
#         except Http404 as e:
#             return Response({'error': str(e)}, status=404)

#         messages = paginated_response.data.get('results', [])
#         if not messages:
#             return Response({'error': 'No messages found between the specified users.'}, status=404)
#         serializer = ChatRoomSerializer({'sender': messages[0]['sender'], 'receiver': messages[0]['receiver'], 'messages': messages})
#         return Response({
#             'chatroom': serializer.data,
#             'next': paginated_response.data.get('next'),
#             'previous': paginated_response.data.get('previous')
#         })

class ChatRoomView(generics.ListAPIView):
    serializer_class = ChatRoomSerializer
    pagination_class = MessagesPageNumberPagination

    # authentication_classes = [authentication.TokenAuthentication]
    def get_queryset(self):
        l_user_name = self.kwargs['l_user']
        r_user_name = self.kwargs['r_user']
        try:
            l_user = User.objects.get(username=l_user_name)
            r_user = User.objects.get(username=r_user_name)
        except User.DoesNotExist:
            raise NotFound("User not found.")

        if not Relationship.objects.filter(Q(user1=l_user, user2=r_user) | Q(user1=r_user, user2=l_user), status=Relationship.Status.FRIEND).exists():
            raise NotFound("These users are not friends.")

        return Message.objects.filter(Q(sender=l_user, receiver=r_user) | Q(sender=r_user, receiver=l_user)).order_by('timestamp')

    # queryset = get_queryset
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        paginated_response = self.paginate_queryset(queryset)
        if not paginated_response:
            return NotFound("No messages found between the specified users.")
        serializer = ChatRoomSerializer({'l_user': paginated_response[0].sender, 'r_user': paginated_response[0].receiver, 'messages': paginated_response})
        return Response({
            'chatroom': serializer.data,
            'next': self.get_paginated_response(paginated_response).data.get('next'),
            'previous': self.get_paginated_response(paginated_response).data.get('previous')
        })

class OnlineUsersPageNumberPagination(PageNumberPagination):
    page_size = 5

class OnlineUsersView(generics.ListAPIView):
    queryset = User.objects.filter(is_online=True)
    serializer_class = UserSerializer
    pagination_class = OnlineUsersPageNumberPagination

    # authentication_classes = [authentication.TokenAuthentication]
    