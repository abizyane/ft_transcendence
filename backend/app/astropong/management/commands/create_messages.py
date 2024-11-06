import random
from django.core.management.base import BaseCommand
from django.utils import timezone
from chat.models import  Message 
from astropong.models import  User 

class Command(BaseCommand):
    help = 'Seed the database with random conversations'

    def handle(self, *args, **kwargs):
        num_messages = 100  
        users = list(User.objects.all()) 
        if len(users) < 2:
            self.stdout.write("Not enough users to create conversations.")
            return

        for _ in range(num_messages):
            sender, receiver = self.get_random_user_pair(users)
            message_text = self.generate_random_message()
            timestamp = self.generate_random_timestamp()
            seen_status = random.choice([True, False]) 

            message = Message.objects.create(
                sender=sender,
                receiver=receiver,
                message=message_text,
                timestamp=timestamp,
                seen=seen_status,
            )
            self.stdout.write(f'Created message from {sender} to {receiver}')

    def get_random_user_pair(self, users):
        """ Select a random pair of users (sender, receiver) without repeats. """
        sender = random.choice(users)
        receiver = random.choice(users)
        while receiver == sender:
            receiver = random.choice(users)
        return sender, receiver

    def generate_random_message(self):
        """ Generate a random message text. """
        sample_messages = [
            "Hello! How's it going?",
            "What's up?",
            "Did you see the game last night?",
            "Let's catch up soon!",
            "Any plans for the weekend?",
            "Don't forget our meeting tomorrow!",
            "Happy birthday!",
            "Can you send me the files?",
        ]
        return random.choice(sample_messages)

    def generate_random_timestamp(self):
        """ Generate a random timestamp in the past 30 days. """
        days_ago = random.randint(0, 30)
        hours_ago = random.randint(0, 23)
        minutes_ago = random.randint(0, 59)
        return timezone.now() - timezone.timedelta(days=days_ago, hours=hours_ago, minutes=minutes_ago)
