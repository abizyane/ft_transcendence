from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async
from rest_framework.authtoken.models import Token
from asgiref.sync import async_to_sync
from .game_utils import Ball,Game,Player
from astropong.models import User
from astropong.serializers import UserSerializer
from game.models import GameModel, Profile
from game.serializers import GameSerializer
import json
import math
import asyncio
import jwt
import time
import asgiref.sync
from channels.exceptions import StopConsumer, DenyConnection

@asgiref.sync.sync_to_async
def get_user(token:str):
    if not token:
        raise ValueError('Auth Fail')
    try:
        payload = jwt.decode(token, "SECRET_KEY", algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        raise ValueError('Auth Fail')
    user = User.objects.filter(id=payload['id']).first()
    if isinstance(user, AnonymousUser):
        raise DenyConnection
    return user

class LobbyConsumer(AsyncWebsocketConsumer):
    players_pool = {}
    async def connect(self):
        try:
            query = self.scope["query_string"].decode()
            token = (query.split("="))[1]
            self.user = await get_user(token)
            self.lobby_name = 'lobby_1'
            await self.accept()
            LobbyConsumer.players_pool[self.channel_name] = await self.get_profile()
            await self.channel_layer.group_add(self.lobby_name, self.channel_name)
            self.game_id = None
            if (len(LobbyConsumer.players_pool) >= 2):
                await self.set_ready()
        except Exception as e :
            print


    async def close(self, e):
        del LobbyConsumer.players_pool[self.channel_name]
        await self.channel_layer.group_discard(
            self.lobby_name, self.channel_name
        )
        await self.channel_layer.group_discard(
            self.game_id, self.channel_name
        )

    async def broadcast(self, event):
        await self.send(text_data=json.dumps({
            'type' : 'send_all',
            'command': event['command'],
            'link': event['link'],
        }))

    @database_sync_to_async
    def set_game(self):
        ps = list(LobbyConsumer.players_pool)
        return GameModel.objects.create(player_1=LobbyConsumer.players_pool[ps[0]], player_2= LobbyConsumer.players_pool[ps[1]])
    
    @database_sync_to_async
    def get_profile(self):
        return Profile.objects.filter(user_id=self.user.id).first()

    async def set_ready(self):
        try:
            game = await self.set_game()
            self.game_id = f'game_{game.id}'
            for channel_name, player in LobbyConsumer.players_pool.items():
                await self.channel_layer.group_add(self.game_id, channel_name)
            await self.channel_layer.group_send(
                self.game_id,
                {
                    'type': 'broadcast',
                    'command': 'set_ready',
                    'link': f'game_start/{game.pk}'
                }
            )
        
            await self.channel_layer.send(self.game_id,{
                'type': 'websocket.close'
            })
        except Exception as e:
            print(f'An error occurred: {e}')


        async def websocket_close(self, event):
            await self.close()






class GameConsumer(AsyncWebsocketConsumer) :
    games = {}
    async def connect(self):
        try:
            self.id = self.scope['url_route']['kwargs']['game_id']
            self.user = await self.get_user()
            self.group_name = ''
            self.game_db = None
            self.game = None
            self.player = await self.get_profile()
        except Exception as e:
            print(f'Error: {e}')
        await self.accept()
        await self.init_game()

    """ GET PROFILE FROM USER"""
    @database_sync_to_async
    def get_profile(self):
        return Profile.objects.filter(user_id=self.user.id).first()
    
    """ GET USER FROM TOKEN """
    async def get_user(self):
        try:
            query = self.scope["query_string"].decode()
            query_split = query.split("=")
            if len(query_split) != 2:
                raise ValueError('Token Error')
            token = query_split[1]
            user = await get_user(token)
        except Exception as e:
            raise e
        return user

    def get_last_game(self):
        action = ''
        try:
            games_list = list(GameConsumer.games.keys())
            if not games_list:
                raise GameConsumer.NoGameInQueue
            last_game_name = games_list[-1]
            last_game = GameConsumer.games.get(int(last_game_name))
            last_game.is_full()
            action = 'JOIN'
        except (GameConsumer.NoGameInQueue, Game.RoomIsFull):
            queue_id = len(games_list)
            # self.queue_id = queue_id
            last_game = self.create_new_game(queue_id)
            action = 'CREATE'
        return last_game,action

    def create_new_game(self,queue_id):
        GameConsumer.games[queue_id] = Game(queue_id)
        return GameConsumer.games[queue_id] 

    def join_game(self):
        self.game.players[self.channel_name] = Player(self.channel_name, self.player, self.game)
    
    async def init_game(self):
        await self.send(text_data=json.dumps({
            "type" : "send.status",
            "status" : "WAIT",
            'user': self.user.username
        }))
        self.game, action = self.get_last_game()
        self.join_game()
        if (len(self.game.players) == 2):
            self.game_db = await self.set_game()
            self.group_name = f'game_{self.game_db.id}'
            for channels_name in self.game.players.keys():
                await self.channel_layer.group_add(self.group_name, channels_name)
            await self.set_game_status(self.game_db, 'START')
            await self.channel_layer.group_send(self.group_name, {
                'type':'broadcast',
                'message_type': 'game_status',
                'message': 'START'
            })
            await self.start_game()
    
    async def broadcast(self, event):
        await self.send(text_data=json.dumps({
            'message_type': event['message_type'],
            'message': event['message']
        }))
    
    @database_sync_to_async
    def set_game(self):
        ps = list(self.game.players.keys())
        player_1 = self.game.players[ps[0]]
        player_2 = self.game.players[ps[1]]
        return GameModel.objects.create(player_1=player_1.user, player_2= player_2.user)

    @database_sync_to_async
    def set_game_status(self,game_db, status):
        game_db.status = status
        game_db.save()
        
    @database_sync_to_async
    def user_has_access(self):
        players = [self.game_db.player_1.get_username(), self.game_db.player_2.get_username()]
        if self.player.get_username() not in players:
            raise ValueError(f'Game ID {self.id} Not Is Unaccessible')

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.group_name, self.channel_name
        )
        del self.game.players[self.channel_name]

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        msgtype = text_data_json['type']
        if msgtype == 'input':
            await self.player_position(text_data_json)


    async def player_position(self, data):
        player = self.game.players[self.channel_name]
        player.isW = True if  data.get('w') == 'true' else False
        player.isS = True if data.get('s') == 'true' else False
    
    async def set_player_id(self):
        self.game.set_players(self.channel_name, self.game.joined_players)
        self.game.players[self.channel_name].color = 'blue' if self.game.joined_players == 0  else 'red'
        self.game.players[self.channel_name].x = 15 if self.game.players[self.channel_name].color == 'blue' else self.game.width - self.game.players[self.channel_name].width - 15
        await self.send(text_data=self.game.get_json_info(self.channel_name))
        self.game.joined_players += 1
        if (self.game.joined_players == 2 and self.game.status == 0):
            self.game.status = 1
            asyncio.create_task(self.game_start())

    async def send_position(self, event):
        player = self.game.players[self.channel_name]
        player2 = None
        for p in self.game.players.keys():
            if not p == self.channel_name:
                player2 = self.game.players[p]
        print(player, player2)
        await self.send(text_data=json.dumps({
            'type': 'send_position',
            'player': player.get_data(),
            'player_two': player2.get_data(),
            'ball': {'x': str(self.game.ball.posX), 'y':str(self.game.ball.posY)},
            'id': str(player.id),
            'channel_name': self.channel_name,
        }))

    async def start_game(self):
        players = []
        players = list(self.game.players.values())
        players[0].id = 0
        players[1].id = 1
        players[0].color = 'blue'
        players[1].color = 'red'
        self.game.set_players_color()
        ball = self.game.ball
        player = self.game.players[self.channel_name]
        player2 = None
        for p in self.game.players.keys():
            if not p == self.channel_name:
                player2 = self.game.players[p]
        fps = 1/60
        while True:
            try:
                ball.update()
                player.update(self.game)
                player2.update(self.game)
                await self.channel_layer.group_send(self.group_name,
                {
                    'type': 'send_position',
                })
                await asyncio.sleep(fps)
            except Exception as e:
                print(e)

    @database_sync_to_async
    def get_game_db(self):
        game = GameModel.objects.get(id=self.id)
        if not game:
            raise ValueError('Game ID False')
        set_game_status(game, 'WAIT')
        return game

    class NoGameInQueue(Exception):
        pass
    