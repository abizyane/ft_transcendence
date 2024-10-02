from rest_framework import views
from rest_framework.response import Response
from .models import Message
from astropong.models.UserModel import User, Relationship
from django.db.models import Q
from django.http import Http404
from rest_framework.pagination import PageNumberPagination
from .serializers import MessageSerializer, ConversationSerializer, ChatRoomSerializer

class ConversationsPageNumberPagination(PageNumberPagination):
    page_size = 7

class ConversationsView(views.APIView):
    def get(self, request):
        paginator = ConversationsPageNumberPagination()
        messages = Message.objects.order_by('-timestamp')
        context = paginator.paginate_queryset(messages, request)
        serializer = ConversationSerializer(context, many=True)
        return paginator.get_paginated_response(serializer.data)

class MessagesPageNumberPagination(PageNumberPagination):
    page_size = 5

class MessagesView(views.APIView):
    def get_messages(self, request, sender, receiver):
        try:
            sender = User.objects.get(username=sender)
            receiver = User.objects.get(username=receiver)
        except User.DoesNotExist:
            raise Http404("User not found.")

        if not Relationship.objects.filter(Q(user1=sender, user2=receiver) | Q(user1=receiver, user2=sender), status=Relationship.Status.FRIEND).exists():
            raise Http404("These users are not friends.")

        messages = Message.objects.filter(Q(sender=sender, receiver=receiver) | Q(sender=receiver, receiver=sender)).order_by('timestamp')
        paginator = MessagesPageNumberPagination()
        context = paginator.paginate_queryset(messages, request)
        serializer = ConversationSerializer(context, many=True)
        return paginator.get_paginated_response(serializer.data)

    def get(self, request, sender, receiver):
        try :
            messages = self.get_messages(request, sender, receiver)
            serializer = MessageSerializer(messages, many=True)
            return Response({'messages': serializer.data})
        except Http404 as e:
            return Response({'error': str(e)}, status=404)

class ChatRoomView(MessagesView):
    def get(self, request, sender, receiver):
        try:
            paginated_response = self.get_messages(request, sender, receiver)
        except Http404 as e:
            return Response({'error': str(e)}, status=404)

        messages = paginated_response.data.get('results', [])
        if not messages:
            return Response({'error': 'No messages found between the specified users.'}, status=404)
        serializer = ChatRoomSerializer({'sender': messages[0]['sender'], 'receiver': messages[0]['receiver'], 'messages': messages})
        return Response({
            'chatroom': serializer.data,
            'next': paginated_response.data.get('next'),
            'previous': paginated_response.data.get('previous')
        })
