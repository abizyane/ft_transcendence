from django.db import models
from astropong.models.UserModel import User

class Message(models.Model):
    message_id = models.AutoField(primary_key=True)
    sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.SET_NULL, null=True)
    receiver = models.ForeignKey(User, related_name='received_messages', on_delete=models.SET_NULL, null=True)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    seen = models.BooleanField(default=False)

    def __str__(self):
        return str(self.sender) + ": " + self.message
