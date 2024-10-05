from django.urls import path
from .views import NotificationListView, NotificationUpdateView

urlpatterns = [
    path('<str:username>/<int:notification_id>/', NotificationUpdateView.as_view(), name='notification'),
    path('list/<str:username>/', NotificationListView.as_view(), name='all_notifications'),
]