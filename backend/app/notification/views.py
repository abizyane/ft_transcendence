from rest_framework import views
from rest_framework.response import Response
from .models import Notifications
from django.http import Http404
from rest_framework.pagination import PageNumberPagination
from astropong.models.UserModel import User
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .serializers import NotificationSerializer


class NotificationPageNumberPagination(PageNumberPagination):
    page_size = 4

class NotificationListView(views.APIView):
    permission_classes = [IsAuthenticated]


    def get_notifications(self, request):
        try:
            user = request.user
        except User.DoesNotExist:
            raise Http404("User not found.")

        notifications = Notifications.objects.filter(user=user).order_by('-timestamp')
        paginator = NotificationPageNumberPagination()
        context = paginator.paginate_queryset(notifications, request)
        serializer = NotificationSerializer(context, many=True)
        return paginator.get_paginated_response(serializer.data)

    def get(self, request):
        try :
            user = request.user
            notifications = Notifications.objects.filter(user=user).order_by('-timestamp')
            return Response(NotificationSerializer(notifications, many=True).data, status=200)
        except Http404 as e:
            return Response({'error': str(e)}, status=404)

class UpdateAllNotificationsView(views.APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        user = request.user
        notifications = Notifications.objects.filter(user=user)
        for notification in notifications:
            notification.seen = True
            notification.save()
        return Response({'message': 'All notifications marked as seen.'}, status=200)

class NotificationUpdateView(views.APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request, notification_id=None):
        try:
            user = request.user
        except User.DoesNotExist:
            raise Http404("User not found.")
        try:
            notification_id = int(notification_id)
        except Exception as e:
            return Response({'error': 'Notification id must be a number'}, status=400)
        
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
