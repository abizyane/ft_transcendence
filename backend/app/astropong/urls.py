from django.contrib import admin
from django.urls import path, include
from .views.auth.register import RegisterView
from .views.auth.login import LoginView
from .views.auth.logout import LogoutView

urlpatterns = [
    path('register', RegisterView.as_view()),
    path('login', LoginView.as_view()),
    path('logout', LogoutView.as_view()),
]
