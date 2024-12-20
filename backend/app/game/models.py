from django.db import models
from astropong.models import User
from django.utils import timezone
from django.db.models.query import EmptyQuerySet

class Profile(models.Model):
    # profile_id = models.AutoField(primary_key=True)
    user_id = models.OneToOneField(User, on_delete=models.CASCADE)
    level = models.FloatField(default=0)
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

    def get_progress(self):
        level_up_threshold = (400, 800, 1200, 2000, 3200, 5200, 8400, 13600, 22000, 35600, 57200, 92800, 150000, 242800, 402800, 642800, 1042800, 1682800, 2722800, 4028000)

        for i in range(len(level_up_threshold)):
            if self.xp < level_up_threshold[i]:
                progress = self.xp / level_up_threshold[i]
                return progress * 100    
        return 100


    def get_wins(self, isTournament:bool=False):
        games = GameModel.get_all_games(self.id, isTournament)
        wins = 0
        for game in games:
            # Get the player's PlayerModel instance for this game
            if game.player_1.profile == self:
                player = game.player_1
            else:
                player = game.player_2
            
            if player.state == PlayerModel.State.WIN:
                wins += 1
        return wins
    def get_losses(self):
        games = GameModel.get_all_games(self.id)
        losses = 0
        for game in games:
            # Get the player's PlayerModel instance for this game
            if game.player_1.profile == self:
                player = game.player_1
            else:
                player = game.player_2
            
            if player.state == PlayerModel.State.LOSE:
                losses += 1
        return losses
    def get_draws(self):
        games = GameModel.get_all_games(self.id)
        draws = 0
        for game in games:
            # Get both players' scores
            if game.player_1.profile == self:
                player_score = game.player_1.score
                opponent_score = game.player_2.score
            else:
                player_score = game.player_2.score
                opponent_score = game.player_1.score
            
            if player_score == opponent_score:
                draws += 1
        return draws
    def get_tournament_wins(self):
        return TournamentModel.objects.filter(winner=self).count()
    def get_tournament_losses(self):
        return TournamentModel.objects.filter(players=self).count()

class PlayerModel(models.Model):
    class State(models.TextChoices):
        WIN = 'WIN'
        LOSE = 'LOSE'
        NEUTRAL = 'NEUTRAL'
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    alias = models.CharField(max_length=50, null=True)
    color = models.CharField(max_length=32)
    score = models.IntegerField(null=False)
    state = models.CharField(max_length=10, choices=State.choices)

class GameModel(models.Model):
    class Type(models.TextChoices):
        SEMIFINAL = 'SEMIFINAL'
        FINAL = 'FINAL'
    player_1 = models.ForeignKey(PlayerModel, related_name="player_one", null=True,on_delete=models.CASCADE)
    player_2 = models.ForeignKey(PlayerModel, related_name="player_two", null=True,on_delete=models.CASCADE)
    status = models.CharField(max_length=5, null=True)
    created = models.DateTimeField(default=timezone.now, null=False)
    updated = models.DateTimeField(default=timezone.now, null=False)
    type = models.CharField(max_length=10, choices=Type.choices, default=None, null=True)
    created.editable = False

    def __str__(self):
        if (self.player_1.alias):
            return f'{self.player_1.alias} vs {self.player_2.alias}'
        return f'{self.player_1.profile.get_username()} vs {self.player_2.profile.get_username()}'

    def get_all_games(player_id:int, isTournament:bool=False) -> models.QuerySet:
        playerModels = PlayerModel.objects.filter(profile_id=player_id).all()
        int_player_models = [playerModel.id for playerModel in playerModels]
        
        games = GameModel.objects.filter((models.Q(player_1__in=int_player_models) | models.Q(player_2__in=int_player_models)))
        if not isTournament:
            games = games.filter(type=None)
        return games.order_by("-created")

    def get_opponent(self, player:Profile) -> Profile:
        if player.id == self.player_1.profile.id:
            return self.player_2
        elif player.id == self.player_2.profile.id:
            return self.player_1
        else:
            return None
    
    def get_player_game_score(self,player_id:int)-> int:
        print(self.player_1.profile.id, self.player_2.profile.id, flush=True)
        scoreObj = Scores.objects.get(id=self.id)
        if not scoreObj:
            return -1
        if self.player_1.profile.id == player_id:
            return scoreObj.score_1
        elif self.player_2.profile.id == player_id:
            return scoreObj.score_2
        else:
            return -1;
    
    def get_player_game_xp(self,player_id:int)-> int:
        scoreObj = Scores.objects.get(id=self.id)
        if not scoreObj:
            return -1
        xp = 100
        if self.player_1.profile.id == player_id and self.player_1.state == PlayerModel.State.WIN:
            xp = xp * 3 if self.type is not None  else xp * 1.5
            xp += scoreObj.score_1 * 20 
            return xp
        elif self.player_2.profile.id == player_id and self.player_2.state == PlayerModel.State.WIN:
            xp = xp * 3 if self.type is not None  else xp * 1.5
            xp += scoreObj.score_2 * 20
            return xp
        elif self.player_1.profile.id == player_id and self.player_1.state == PlayerModel.State.LOSE:
            xp = xp / 2
            xp += scoreObj.score_1 * 10 
            return xp
        elif self.player_2.profile.id == player_id and self.player_2.state == PlayerModel.State.LOSE:
            xp = xp / 2
            xp += scoreObj.score_2 * 10
            return xp
        elif self.player_1.state == PlayerModel.State.NEUTRAL and self.player_1.state == PlayerModel.State.NEUTRAL:
            return 100
        else:
            return 0


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
    class TournamentType(models.TextChoices):
        TWO = 'TWO'
        FOUR = 'FOUR'
        EIGHT = 'EIGHT'

    # tournament_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, default='AstroTournament')
    owner = models.ForeignKey(Profile, related_name='tournament_owner', null=True, on_delete=models.CASCADE)
    picture = models.TextField(null=True)
    games = models.ManyToManyField(GameModel, related_name='tournament_games')
    players = models.ManyToManyField(Profile, related_name="tournament_competitors")
    winner = models.ForeignKey(Profile, related_name="tournament_winner" ,null=True, on_delete=models.CASCADE)
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
        return TournamentModel.objects.filter(players__id=player_id)
    
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
