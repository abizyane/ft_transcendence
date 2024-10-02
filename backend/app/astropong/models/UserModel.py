from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    username = models.CharField(max_length=100,unique=True)
    email = models.CharField(max_length=100,unique=True)
    password = models.CharField(max_length=255)
    profile_pic = models.ImageField(blank=True, null=True)
    is_online = models.BooleanField(default=False)
    friends = models.ManyToManyField('self', through='Relationship', symmetrical=False, related_name='friends_of')
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []


class Relationship(models.Model):
    class Status(models.TextChoices):
        BLOCKED = 'BL', 'Blocked'
        FRIEND = 'FR', 'Friend'
        UNKNOWN = 'UN', 'Unknown'

    relationship_id = models.AutoField(primary_key=True)
    user1 = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='relationships_as_user1')
    user2 = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='relationships_as_user2')
    status = models.CharField(max_length=2, choices=Status.choices, default=Status.UNKNOWN)

    def __str__(self):
        return str(self.user1) + " - " + str(self.user2) + ": " + self.status
