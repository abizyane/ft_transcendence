from django.urls import path
from .views import NotificationListView, NotificationUpdateView, UpdateAllNotificationsView

urlpatterns = [
    path('update/<int:notification_id>/', NotificationUpdateView.as_view(), name='notification'),
    path('update/', UpdateAllNotificationsView.as_view(), name='update_all_notifications'),
    path('list/', NotificationListView.as_view(), name='all_notifications'),
]