from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError

# Create your models here.

class User(AbstractUser):
    username = models.CharField(max_length=100,unique=True)
    email = models.CharField(max_length=100,unique=True)
    password = models.CharField(max_length=255)
    profile_pic = models.CharField(max_length=500, null=True)
    is_online = models.BooleanField(default=False)
    friends = models.ManyToManyField('self', through='Relationship', symmetrical=False, related_name='friends_of')
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def add_friend(self, friend):
        relationship, created = Relationship.objects.get_or_create(
            user1=self,
            user2=friend,
            defaults={'status': Relationship.Status.FRIENDREQUEST}
        )

        if not created:
            if relationship.status == Relationship.Status.FRIENDREQUEST:
                raise ValidationError("You already sent a friend request to this user.")
            elif relationship.status != Relationship.Status.BLOCKED:
                relationship.status = Relationship.Status.FRIENDREQUEST
                relationship.save()
            else:
                raise ValidationError("You cannot add a blocked user as a friend.")

    def accept_friend_request(self, friend):
        try:
            relationship = Relationship.objects.get(
                user1=friend,
                user2=self,
                status=Relationship.Status.FRIENDREQUEST
            )
            relationship.status = Relationship.Status.FRIENDS
            relationship.save()
        except Relationship.DoesNotExist:
            raise ValidationError("No friend request from this user.")

    def refuse_friend_request(self, friend):
        try:
            relationship = Relationship.objects.get(
                user1=friend,
                user2=self,
                status=Relationship.Status.FRIENDREQUEST
            )
            relationship.delete()
        except Relationship.DoesNotExist:
            raise ValidationError("No friend request from this user.")
    def block_friend(self, friend):
        try:
            relationship = Relationship.objects.get(
                user1=self,
                user2=friend
            )
            relationship.status = Relationship.Status.BLOCKED
            relationship.save()
        except Relationship.DoesNotExist:
            relationship = Relationship.objects.create(
                user1=self,
                user2=friend,
                status=Relationship.Status.BLOCKED
            )

    def unblock_friend(self, friend):
        try:
            relationship = Relationship.objects.get(
                user1=self,
                user2=friend
            )
            if relationship.status == Relationship.Status.BLOCKED:
                relationship.status = Relationship.Status.UNKNOWN
                relationship.save()
            else:
                raise ValidationError("You can only unblock a blocked friend.")
        except Relationship.DoesNotExist:
            raise ValidationError("You cannot unblock a friend you don't have a relationship with.")

class Relationship(models.Model):
    class Status(models.TextChoices):
        BLOCKED = 'BL', 'Blocked'
        FRIEND = 'FR', 'Friend'
        FRIENDREQUEST = 'FRREQ', 'Friend Request'
        UNKNOWN = 'UN', 'Unknown'

    relationship_id = models.AutoField(primary_key=True)
    user1 = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='relationships_as_user1')
    user2 = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='relationships_as_user2')
    status = models.CharField(max_length=5, choices=Status.choices, default=Status.UNKNOWN)

    def __str__(self):
        return str(self.user1) + " - " + str(self.user2) + ": " + self.status
