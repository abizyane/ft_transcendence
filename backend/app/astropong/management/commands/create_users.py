import os
import random
import string
from django.core.management.base import BaseCommand
from django.utils.crypto import get_random_string
from django.contrib.auth.hashers import make_password
from astropong.models import User  

class Command(BaseCommand):
    help = 'Create random users'

    def handle(self, *args, **kwargs):
        num_users = 28  
        usernames = set()  
        for i in range(num_users):
            username = self.generate_unique_username(usernames)
            email = f"{username}@example.com"
            password = get_random_string(12)  
            hashed_password = make_password(password)  
            profile_pic = self.generate_random_profile_pic()
            is_online = random.choice([True, False])  

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
        placeholder_images = [
            'https://randomuser.me/api/portraits/women/77.jpg',
            'https://randomuser.me/api/portraits/women/67.jpg',
            'https://randomuser.me/api/portraits/women/79.jpg',
            'https://randomuser.me/api/portraits/women/17.jpg',
            'https://randomuser.me/api/portraits/women/27.jpg',
            'https://randomuser.me/api/portraits/women/7.jpg',
            'https://randomuser.me/api/portraits/women/47.jpg',
            'https://randomuser.me/api/portraits/women/10.jpg',
            'https://randomuser.me/api/portraits/women/27.jpg',
            'https://randomuser.me/api/portraits/women/13.jpg',
            'https://randomuser.me/api/portraits/women/57.jpg',
            'https://randomuser.me/api/portraits/women/67.jpg',
            'https://randomuser.me/api/portraits/women/16.jpg',
            'https://randomuser.me/api/portraits/women/18.jpg',
            'https://randomuser.me/api/portraits/women/77.jpg',
            'https://randomuser.me/api/portraits/women/87.jpg',
        ]
        return random.choice(placeholder_images)
