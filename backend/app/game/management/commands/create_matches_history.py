from django.core.management.base import BaseCommand
from django.utils import timezone
from game.models import Profile, GameModel, Scores
from astropong.models import User
import random
from datetime import timedelta

class Command(BaseCommand):
    help = 'Creates sample match history data'

    def handle(self, *args, **kwargs):
        # Get all profiles
        profiles = Profile.objects.all()
        if len(profiles) < 2:
            self.stdout.write(self.style.ERROR('Need at least 2 profiles to create matches'))
            return

        # Create 20 random matches
        for i in range(20):
            # Select two random players
            players = random.sample(list(profiles), 2)
            player1, player2 = players

            # Create random scores (between 0-11, one player must have at least 11)
            if random.choice([True, False]):
                score1 = 11
                score2 = random.randint(0, 9)
            else:
                score1 = random.randint(0, 9)
                score2 = 11

            # Create the game with a random date in the last 30 days
            random_days = random.randint(0, 30)
            game_date = timezone.now() - timedelta(days=random_days)
            
            game = GameModel.objects.create(
                player_1=player1,
                player_2=player2,
                status='END',
                created=game_date,
                updated=game_date
            )

            # Create the score record
            Scores.objects.create(
                game_id=game,
                score_1=score1,
                score_2=score2,
                created=game_date,
                updated=game_date
            )

            # Update player XP based on the match result
            xp_gain = random.randint(50, 150)
            if score1 > score2:
                player1.xp += xp_gain
                player2.xp += xp_gain // 2
            else:
                player2.xp += xp_gain
                player1.xp += xp_gain // 2

            player1.save()
            player2.save()

            self.stdout.write(
                self.style.SUCCESS(
                    f'Created match: {player1.get_username()} ({score1}) vs {player2.get_username()} ({score2})'
                )
            )

        self.stdout.write(self.style.SUCCESS('Successfully created match history')) 