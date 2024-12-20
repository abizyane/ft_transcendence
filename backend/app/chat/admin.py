from django.contrib import admin
from .models import Message
from astropong.models.UserModel import User, Relationship


admin.site.register(User)
admin.site.register(Relationship)
admin.site.register(Message)
