from django.urls import path
from .views import NotificationListView

urlpatterns = [
    path('list/<str:username>/', NotificationListView.as_view(), name='notification-list'),
]