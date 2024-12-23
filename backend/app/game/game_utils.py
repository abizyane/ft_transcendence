import math
import json

class Ball:
    def __init__(self, game):
        self.game = game
        self.rad = 10
        self.posX = game.width / 2
        self.posY = game.height / 2
        self.speed = 600
        self.angle = 40
        self.dirX = math.cos(self.angle)
        self.dirY = math.sin(self.angle)
        pass

    def checkCollide(self):
        if (self.posY + self.rad >= self.game.height or self.posY - self.rad <= 0 ):
            self.dirY *= -1
        left_collision = self.posX - self.rad
        if (left_collision <= 0):
            self.game.red.score += 1
            self.reset_ball()
        if ((left_collision <= self.game.blue.x  + self.game.blue.width ) and (self.posY >= self.game.blue.y and self.posY <= self.game.blue.y + self.game.blue.height) and not self.game.blue.isHiting):
            self.dirX *= -1
            self.game.blue.isHiting = True
        right_collision = self.posX + self.rad
        if (right_collision >= self.game.width):
            self.game.blue.score += 1
            self.reset_ball()
        if ((right_collision >= self.game.red.x) and (self.posY >= self.game.red.y and self.posY <= self.game.red.y + self.game.red.height) and not self.game.red.isHiting):
            self.dirX *= -1
            self.game.red.isHiting = True
        self.game.red.isHiting = False
        self.game.blue.isHiting = False
            
            
    
    def reset_ball(self):
        self.posY = self.game.height / 2
        self.posX = self.game.width / 2 

    def update(self):
        self.checkCollide()
        self.posX += (self.dirX * self.speed) * 0.01666
        self.posY += (self.dirY * self.speed) * 0.01666

class Player:
    def __init__(self, channel_name=None, id=None, game=None):
        self.channel_name = channel_name
        self.id = id
        self.score = 0
        self.width = 2
        self.height = 100
        self.half_width = self.width / 2
        self.half_height = self.height / 2
        self.x = 0
        self.y = game.height/ 2
        self.color = ''
        self.speed = 8
        self.isW = False
        self.isS = False
        self.isHiting = False
        self.win_state = 'Neutral'
    pass

    def update(self, game):
        if self.isW:
            self.y -= 0 if (self.y - self.speed) < 0 else self.speed
        if self.isS:
            self.y += 0 if (self.y + self.speed + self.height) > game.height else self.speed
        pass

    def get_data(self):
        return(self.__dict__)

class Game:
    def __init__(self, id):
        self.game_id = id
        self.joined_players = 0
        self.players = {}
        self.profiles = {}
        self.players_color ={}
        self.width = 1080
        self.height= 720
        self.status = 0
        self.ball = Ball(self)
        self.blue = None
        self.red = None
        self.max_score = 2
        self.x_offset = 5

    def is_full(self):
        if len(self.players) == 2:
            raise self.RoomIsFull()

    def init_paddle_pos(self):
        self.blue.x = self.x_offset
        self.red.x = self.width - self.red.width - self.x_offset
    def set_players(self, channel_name, id):
        self.is_full()
        if not self.players.get(channel_name):
            self.players[channel_name] = Player(channel_name, self)
        self.players[channel_name].id = id

    def set_players_color(self):
        self.players_color = {player.color: player for player in self.players.values()}
        self.blue = self.players_color['blue']
        self.red = self.players_color['red']
    
    def get_json_info(self, channel_name):
        data = {
            'type': 'send_id',
            'player_id': channel_name,
            'player_color': self.players[channel_name].color,
            'width': self.width,
            'height': self.height,
        }
        return json.dumps(data)
    
    def update(self):
        self.ball.update()
        self.red.update(self)
        self.blue.update(self)
        
    def update_status(self):
        scores = [player.score for player in  self.players.values()]
        if self.max_score in scores:
            self.status = 1

    def set_winner(self):
        for player in self.players.values():
            if player.score == self.max_score:
                player.win_state = "WIN"
            else:
                player.win_state = "LOSE" 
        
    class RoomIsFull(Exception):
        def __init__(self):
            super().__init__(f'You Cannot join this game , Room  is Full')
