import os
import random
import string
from django.core.management.base import BaseCommand
from django.utils.crypto import get_random_string
from django.contrib.auth.hashers import make_password
from astropong.models import User  # Import your custom User model

class Command(BaseCommand):
    help = 'Create random users'

    def handle(self, *args, **kwargs):
        num_users = 28  # Number of users to create
        usernames = set()  # To avoid duplicate usernames
        for i in range(num_users):
            username = self.generate_unique_username(usernames)
            email = f"{username}@example.com"
            password = get_random_string(12)  # Generate a random 12-character password
            hashed_password = make_password(password)  # Hash the password
            profile_pic = self.generate_random_profile_pic()
            is_online = random.choice([True, False])  # Randomly set online status

            # Create the user
            user = User.objects.create(
                username=username,
                email=email,
                password=hashed_password,
                profile_pic=profile_pic,
                is_online=is_online,
            )
            self.stdout.write(f'Created user {username} with email {email}')

    def generate_unique_username(self, usernames):
        """ Generate a unique username. """
        while True:
            username = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
            if username not in usernames:
                usernames.add(username)
                return username

    def generate_random_profile_pic(self):
        """ Return a random placeholder image for the profile picture. """
        # You can replace these paths with your own images or image URLs.
        placeholder_images = [
            'path/to/image1.jpg',
            'path/to/image2.jpg',
            'path/to/image3.jpg',
            'path/to/image4.jpg',
        ]
        return random.choice(placeholder_images)
