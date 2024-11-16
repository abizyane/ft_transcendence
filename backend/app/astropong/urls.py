from django.contrib import admin
from django.urls import path, include
from .views.auth.register import RegisterView
from .views.auth.login import LoginView ,UserListView
from .views.auth.logout import LogoutView
from .views.auth.OAuth import OAuth, OAuthCallback
from .views.auth.auth_user import UserView,MFAView, UsersView, ChangePasswordView, UserIdView, UploadProfilePicView
from .views.auth.refresh import RefreshTokenView
from .views.friends.friends import AddFriendView, ListFriendView, AcceptFriendRequestView, RemoveFriendView, RejectFriendRequestView,FriendsOfView, BlockFriendView,UnblockFriendView, BlockedUsersList

urlpatterns = [
    path('register', RegisterView.as_view(), name='register'),
    path('login', LoginView.as_view(), name='login'),
    path('logout', LogoutView.as_view()),
    path('42OAuth', OAuth.as_view()),
    path('42OAuth/callback', OAuthCallback.as_view()),
    path('2fa_code', MFAView.as_view(), name='2fa_code'),

    path('user', UserView.as_view()),
    path('refresh', RefreshTokenView.as_view()),
    path('users', UserListView.as_view(), name='user_list'),
    path('upload_image', UploadProfilePicView.as_view(), name='change_password'),
    path('changepassword', ChangePasswordView.as_view(), name='change_password'),
    path('userid', UserIdView.as_view(), name='user_id'),
    path('searchuser', UsersView.as_view(), name='user_list'),
    path('block', BlockFriendView.as_view(), name='block'),
    path('unblock', UnblockFriendView.as_view(), name='unblock'),

    path('blocked', BlockedUsersList.as_view(), name='list_blocked'),

    path('friends/<str:relationship_type>/', ListFriendView.as_view(), name='list_friends_by_type'),
    path('friends/', ListFriendView.as_view(), name='list_all_friends'),
    path('friendsof/<int:user_id>', FriendsOfView.as_view(), name='friends_of'),
    path('add_friend', AddFriendView.as_view(), name='add_friend'),
    path('accept_friend', AcceptFriendRequestView.as_view(), name='accept_friend'),
    path('reject_friend', RejectFriendRequestView.as_view(), name='reject_friend'),
    path('remove_friend', RemoveFriendView.as_view(), name='remove_friend'),

]
