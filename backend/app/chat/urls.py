"""
URL configuration for base project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import include, path
from .views import ChatRoomView, ConversationsView, OnlineUsersView

urlpatterns = [
    path('room/<int:id>/', ChatRoomView.as_view(), name='room'),
    path('conversations/', ConversationsView.as_view(), name='conversations'),
    path('online/', OnlineUsersView.as_view(), name='online'),
]
