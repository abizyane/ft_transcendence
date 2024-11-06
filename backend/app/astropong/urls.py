from django.contrib import admin
from django.urls import path, include
from .views.auth.register import RegisterView
from .views.auth.login import LoginView ,UserListView
from .views.auth.logout import LogoutView
from .views.auth.OAuth import OAuth, OAuthCallback
from .views.auth.auth_user import UserView
from .views.auth.refresh import RefreshTokenView
from .views.friends.friends import AddFriendView, ListFriendView

urlpatterns = [
    path('register', RegisterView.as_view()),
    path('login', LoginView.as_view()),
    path('logout', LogoutView.as_view()),
    path('42OAuth', OAuth.as_view()),
    path('42OAuth/callback', OAuthCallback.as_view()),
    path('user', UserView.as_view()),
    path('refresh', RefreshTokenView.as_view()),
    path('users', UserListView.as_view(), name='user_list'),
    path('list_friends', ListFriendView.as_view(), name='list_friends'),
    path('add_friend', AddFriendView.as_view(), name='add_friend'),
]

