from django.db import models
# from django.contrib.auth.models import AbstractUser, Group, Permission
from astropong.models.UserModel import User

# class User(AbstractUser):
#     profile_pic = models.ImageField(blank=True, null=True)
#     is_online = models.BooleanField(default=False)
#     friends = models.ManyToManyField('self', through='Relationship', symmetrical=False, related_name='friends_of')
#     groups = models.ManyToManyField(Group, blank=True, related_name="all_user_groups")
#     user_permissions = models.ManyToManyField(Permission, blank=True, related_name="all_user_permissions")

#     def __str__(self):
#         return self.username

# class Relationship(models.Model):
#     class Status(models.TextChoices):
#         BLOCKED = 'BL', 'Blocked'
#         FRIEND = 'FR', 'Friend'
#         UNKNOWN = 'UN', 'Unknown'

#     relationship_id = models.AutoField(primary_key=True)
#     user1 = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='relationships_as_user1')
#     user2 = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='relationships_as_user2')
#     status = models.CharField(max_length=2, choices=Status.choices, default=Status.UNKNOWN)

#     def __str__(self):
#         return str(self.user1) + " - " + str(self.user2) + ": " + self.status

class Message(models.Model):
    message_id = models.AutoField(primary_key=True)
    sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.SET_NULL, null=True)
    receiver = models.ForeignKey(User, related_name='received_messages', on_delete=models.SET_NULL, null=True)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    seen = models.BooleanField(default=False)

    def __str__(self):
        return str(self.sender) + ": " + self.message
