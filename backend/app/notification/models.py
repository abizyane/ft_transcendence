from django.db import models

# Create your models here.
class Notifications(models.Model):
    notification_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('astropong.User', on_delete=models.SET_NULL, null=True, related_name='notifications')
    type = models.CharField(max_length=50)
    content = models.TextField()
    link = models.TextField(null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    seen = models.BooleanField(default=False)

    def __str__(self):
        return str(self.user) + ": " + self.content