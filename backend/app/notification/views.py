from rest_framework import views
from rest_framework.response import Response
from .models import Notifications
from django.http import Http404
from rest_framework.pagination import PageNumberPagination
from rest_framework import serializers
from astropong.models.UserModel import User
from rest_framework import viewsets

# User = get_user_model()

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notifications
        fields = ['notification_id', 'user', 'type', 'content', 'timestamp', 'seen']

class NotificationPageNumberPagination(PageNumberPagination):
    page_size = 4

class NotificationListView(views.APIView):
    def get_notifications(self, request, username):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise Http404("User not found.")

        notifications = Notifications.objects.filter(user=user).order_by('-timestamp')
        paginator = NotificationPageNumberPagination()
        context = paginator.paginate_queryset(notifications, request)
        serializer = NotificationSerializer(context, many=True)
        return paginator.get_paginated_response(serializer.data)

    def get(self, request, username):
        try :
            paginated_response = self.get_notifications(request, username)
            notifications = paginated_response.data.get('results', [])
            if not notifications:
                return Response({'error': 'No notifications found for the specified user.'}, status=404)
            return Response({
                'notifications': notifications,
                'next': paginated_response.data.get('next'),
                'previous': paginated_response.data.get('previous')
            })
        except Http404 as e:
            return Response({'error': str(e)}, status=404)

class NotificationUpdateView(views.APIView):
    def put(self, request, username, notification_id=None):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise Http404("User not found.")
        
        if notification_id is None:
            notifications = Notifications.objects.filter(user=user)
            for notification in notifications:
                notification.seen = True
                notification.save()
            return Response({'message': 'All notifications marked as seen.'}, status=200)
        else:
            try:
                notification = Notifications.objects.get(user=user, notification_id=notification_id)
                notification.seen = True
                notification.save()
                return Response({'message': 'Notification marked as seen.'}, status=200)
            except Notifications.DoesNotExist:
                return Response({'error': 'Notification does not exist.'}, status=404)
