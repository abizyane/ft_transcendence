from django.db import models
from astropong.models import User
from django.utils import timezone
from django.db.models.query import EmptyQuerySet

class Profile(models.Model):
    profile_id = models.AutoField(primary_key=True)
    user_id = models.OneToOneField(User, on_delete=models.CASCADE)
    level = models.IntegerField()
    xp = models.IntegerField()
    created = models.DateTimeField(default=timezone.now, null=False)
    updated = models.DateTimeField(default=timezone.now, null=False)
    created.editable = False

    def __str__(self):
        return f"{self.user_id.username}, lvl:{self.level}"

    def get_username(self):
        return self.user_id.username
    
    def get_profile_pic(self, request):
        from astropong.serializers.UserSerializer import UserSerializer
        return UserSerializer(self.user_id, context={'request': request}).data['profile_pic_url']
    
    def history(self):
        games = GameModel.get_all_games(self.id)
        if not games:
            print('No game played Yet !')
            return None
        for game in games:
            score = game.get_player_game_score(self.id)
            opponent = game.get_opponent(self)
            print(score, opponent)

    def increment_xp(self, xp):
        self.xp += xp
        self.save()
        self.calculate_xp()

    def calculate_xp(self):
        level_up_threshold = (400, 800, 1200, 2000, 3200, 5200, 8400, 13600, 22000, 35600, 57200, 92800, 150000, 242800, 402800, 642800, 1042800, 1682800, 2722800, 4028000)

        for i in range(len(level_up_threshold)):
            if self.xp < level_up_threshold[i]:
                progress = self.xp / level_up_threshold[i]
                self.level = i + progress
                break
            elif self.xp >= level_up_threshold[i] and i == len(level_up_threshold) - 1:
                self.level = len(level_up_threshold) + 1

        self.level = round(self.level, 3)
        self.save()


class GameModel(models.Model):
    player_1 = models.ForeignKey(Profile, related_name="player_one", null=True,on_delete=models.CASCADE)
    player_2 = models.ForeignKey(Profile, related_name="player_two", null=True,on_delete=models.CASCADE)
    status = models.CharField(max_length=5, null=True)
    created = models.DateTimeField(default=timezone.now, null=False)
    updated = models.DateTimeField(default=timezone.now, null=False)
    created.editable = False

    def get_all_games(player_id:int) -> models.QuerySet:
        games = GameModel.objects.filter(player_1=player_id) | GameModel.objects.filter(player_2=player_id)
        return games.order_by("created")

    def get_opponent(self, player:Profile):
        if player.id == self.player_1.pk:
            return self.player_2
        elif player.id == self.player_2.pk:
            return self.player_1
        else:
            return None
    
    def get_player_game_score(self,player_id:int)-> int:
        scoreObj = Scores.objects.get(id=self.id)
        if not scoreObj:
            return -1
        if self.player_1.id == player_id:
            return scoreObj.score_1
        elif self.player_2.id == player_id:
            return scoreObj.score_2
        else:
            return -1;

    def __str__(self):
        return f"{self.player_1.get_username()} vs {self.player_2.get_username()}"


class Scores(models.Model):
    game_id = models.OneToOneField(GameModel, on_delete=models.CASCADE)
    score_1 = models.IntegerField()
    score_2 = models.IntegerField()
    created = models.DateTimeField(default=timezone.now, null=False)
    updated = models.DateTimeField(default=timezone.now, null=False)
    created.editable = False

    def get_all_player_scores(player_id:int):
        games = GameModel.get_all_games(player_id)
        scores = Scores.objects.filter(game_id__in=games)
        return scores


class TournamentModel(models.Model):
    class State(models.TextChoices):
        SCHEDULED = 'SCHEDULED'
        ONGOING = 'ONGOING'
        COMPLETED = 'COMPLETED'

    class TournamentType(models.TextChoices):
        TWO = 'TWO'
        FOUR = 'FOUR'
        EIGHT = 'EIGHT'

    tournament_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, default='AstroTournament')
    start_time = models.DateTimeField(default=timezone.now + timezone.timedelta(days=1))
    state = models.CharField(max_length=10, choices=State.choices, default=State.SCHEDULED)
    tournament_type = models.CharField(max_length=5, choices=TournamentType.choices, default=TournamentType.TWO)
    players = models.ManyToManyField(Profile, related_name='tournament_players')
    games = models.ManyToManyField(GameModel, related_name='tournament_games')
    winner = models.ForeignKey(Profile, related_name='tournament_winner', null=True, on_delete=models.CASCADE)

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now_add=True)
    created.editable = False

    # def history(player:Profile):
    #     games = GameModel.get_all_games(player_id=player.id);
    #     for game in games :
    #         score = Scores.objects.all()[game.id].get_player_game_score(player.id)
    #         oppenent = game.get_opponent(player.id)
    #         oppenent_score = self.get_player_game_score(player.id)
    #         state = "Win" if score > oppenent_score else "Lose"
    #         print(f'{player.get_username()} {score}  Vs  {oppenent.get_username()} {oppenent}')