from django.db import models
from astropong.models import User
from django.utils import timezone
from django.db.models.query import EmptyQuerySet

class Profile(models.Model):
    # profile_id = models.AutoField(primary_key=True)
    user_id = models.OneToOneField(User, on_delete=models.CASCADE)
    level = models.IntegerField()
    xp = models.IntegerField()
    created = models.DateTimeField(default=timezone.now, null=False)
    updated = models.DateTimeField(default=timezone.now, null=False)
    user_paddle_color = models.CharField(max_length=100, null=False, default="#0000ff")
    opponent_paddle_color = models.CharField(max_length=100, null=False, default="#fc0303")
    ball_color = models.CharField(max_length=100, null=False, default="#d400ff")
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

        self.level = round(self.level, 2)
        self.save()
    def get_wins(self):
        games = GameModel.get_all_games(self.id)
        wins = 0
        for game in games:
            score = Scores.objects.get(game_id=game)
            if score.get_winner() == self:
                wins += 1
        return wins
    def get_losses(self):
        games = GameModel.get_all_games(self.id)
        losses = 0
        for game in games:
            score = Scores.objects.get(game_id=game)
            winner = score.get_winner()
            if winner and winner != self:
                losses += 1
        return losses
    def get_draws(self):
        games = GameModel.get_all_games(self.id)
        draws = 0
        for game in games:
            score = Scores.objects.get(game_id=game)
            if score.get_winner() is None:
                draws += 1
        return draws
    def get_tournament_wins(self):
        return TournamentModel.get_all_tournaments(self.id).filter(winner=self.id).count()
    def get_tournament_losses(self):
        return TournamentModel.get_all_tournaments(self.id).filter(~models.Q(winner=self.id)).count()

class GameModel(models.Model):
    class Type(models.TextChoices):
        SEMIFINAL = 'SEMIFINAL'
        FINAL = 'FINAL'
    player_1 = models.ForeignKey(Profile, related_name="player_one", null=True,on_delete=models.CASCADE)
    player_2 = models.ForeignKey(Profile, related_name="player_two", null=True,on_delete=models.CASCADE)
    status = models.CharField(max_length=5, null=True)
    created = models.DateTimeField(default=timezone.now, null=False)
    updated = models.DateTimeField(default=timezone.now, null=False)
    type = models.CharField(max_length=10, choices=Type.choices, default=None, null=True)
    created.editable = False

    def get_all_games(player_id:int) -> models.QuerySet:
        games = GameModel.objects.filter(models.Q(player_1=player_id) | models.Q(player_2=player_id))
        return games.order_by("created")

    def get_opponent(self, player:Profile) -> Profile:
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
    
    def get_player_game_xp(self,player_id:int)-> int:
        scoreObj = Scores.objects.get(id=self.id)
        if not scoreObj:
            return -1
        if self.player_1.id == player_id:
            return scoreObj.score_1
        elif self.player_2.id == player_id:
            return scoreObj.score_2
        else:
            return -1


class Scores(models.Model):
    game_id = models.OneToOneField(GameModel, on_delete=models.CASCADE)
    score_1 = models.IntegerField()
    score_2 = models.IntegerField()
    created = models.DateTimeField(default=timezone.now, null=False)
    updated = models.DateTimeField(default=timezone.now, null=False)
    created.editable = False

    def get_player_scores(player_id:int):
        games = GameModel.get_all_games(player_id)
        scores = Scores.objects.filter(game_id__in=games)
        return scores
    def get_winner(self):
        if self.score_1 > self.score_2:
            return self.player_1
        elif self.score_1 < self.score_2:
            return self.player_2
        else:
            return None


def get_default_start_time():
    return timezone.now() + timezone.timedelta(days=1)


class TournamentModel(models.Model):
    class State(models.TextChoices):
        SCHEDULED = 'SCHEDULED'
        ONGOING = 'ONGOING'
        COMPLETED = 'COMPLETED'

    class TournamentType(models.TextChoices):
        TWO = 'TWO'
        FOUR = 'FOUR'
        EIGHT = 'EIGHT'
    
    class Permission(models.TextChoices):
        PUBLIC = 'PUBLIC'
        PRIVATE = 'PRIVATE'

    # tournament_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, default='AstroTournament')
    permission = models.CharField(max_length=10, choices=Permission.choices, default=Permission.PUBLIC)
    owner = models.ForeignKey(Profile, related_name='tournament_owner', null=True, on_delete=models.CASCADE)
    invites = models.ManyToManyField(Profile, related_name='tournament_invites')
    picture = models.ImageField(upload_to='tournament_pictures/', null=True)
    
    players = models.ManyToManyField(Profile, related_name='tournament_players')
    games = models.ManyToManyField(GameModel, related_name='tournament_games')
    winner = models.ForeignKey(Profile, related_name='tournament_winner', null=True, on_delete=models.
    CASCADE)

    state = models.CharField(max_length=10, choices=State.choices, default=State.SCHEDULED)
    tournament_type = models.CharField(max_length=5, choices=TournamentType.choices, default=TournamentType.TWO)    
    start_time = models.DateTimeField(default=get_default_start_time)

    created = models.DateTimeField(default=timezone.now, null=False)
    updated = models.DateTimeField(default=timezone.now, null=False)
    created.editable = False

    # def history(player:Profile):
    #     games = GameModel.get_all_games(player_id=player.id);
    #     for game in games :
    #         score = Scores.objects.all()[game.id].get_player_game_score(player.id)
    #         oppenent = game.get_opponent(player.id)
    #         oppenent_score = self.get_player_game_score(player.id)
    #         state = "Win" if score > oppenent_score else "Lose"
    #         print(f'{player.get_username()} {score}  Vs  {oppenent.get_username()} {oppenent}')
    
    def get_tournament_xp(self,player_id:int)-> int:
        return self.get_player_game_xp(player_id)

    def get_all_tournaments(player_id:int)-> models.QuerySet:
        return TournamentModel.objects.filter(players=player_id)
    
class TournamentPic(models.Model):
    tournament_id = models.OneToOneField(TournamentModel, on_delete=models.CASCADE, null=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    picture = models.CharField(max_length=500, null=True)


class GameInvite(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING'
        ACCEPTED = 'ACCEPTED'
    user_created = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='game_invites_created')
    user_invited = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='game_invites_invited')
    token = models.CharField(max_length=100, null=True)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)