from django.contrib import admin
from .models import User, Relationship, Message

# Register your models here.

admin.site.register(User)
admin.site.register(Relationship)
admin.site.register(Message)
