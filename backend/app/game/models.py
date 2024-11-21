from django.db import models
from astropong.models import User
from django.utils import timezone
from django.db.models.query import EmptyQuerySet



class Profile(models.Model):
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

    def calculate_xp(self):
        level_up_threshold = 1000
        self.level = self.xp / level_up_threshold
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

    # def history(player:Profile):
    #     games = GameModel.get_all_games(player_id=player.id);
    #     for game in games :
    #         score = Scores.objects.all()[game.id].get_player_game_score(player.id)
    #         oppenent = game.get_opponent(player.id)
    #         oppenent_score = self.get_player_game_score(player.id)
    #         state = "Win" if score > oppenent_score else "Lose"
    #         print(f'{player.get_username()} {score}  Vs  {oppenent.get_username()} {oppenent}')


