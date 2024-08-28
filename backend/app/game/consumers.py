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
import asgiref.sync

@asgiref.sync.sync_to_async
def get_user(token:str):
    if not token:
        raise ValueError('Auth Fail')
    try:
        payload = jwt.decode(token, "SECRET_KEY", algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        raise ValueError('Auth Fail')
    user = User.objects.filter(id=payload['id']).first()
    return user

class LobbyConsumer(AsyncWebsocketConsumer):
    players_pool = {}
    async def connect(self):
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
        # try:
            self.id = self.scope['url_route']['kwargs']['game_id']
            self.user = await self.get_user()
            self.groupe_name = f'game_{self.id}'
            self.game_db = None
            self.game = None
            self.player = await self.get_profile()
            await self.accept()
            await self.init_game()
        # except Exception as e:
            # print(f'Error: {e}')

        # await self.send(text_data={"game":GameSerializer(game).data})

    @database_sync_to_async
    def get_profile(self):
        return Profile.objects.filter(user_id=self.user.id).first()
    
    async def get_user(self):
        try:
            query = self.scope["query_string"].decode()
            token = (query.split("="))[1]
            user = await get_user(token)
        except Exception as e:
            raise e
        return user

    async def init_game(self):
        self.game_db = await self.get_game_db()
        # await self.print_game(self.game_db)
        await self.user_has_access()
        await self.channel_layer.group_add(self.groupe_name, self.channel_name)
        if not GameConsumer.games.get(self.groupe_name):
            GameConsumer.games[self.groupe_name] = Game(int(self.id))
        self.game = GameConsumer.games[self.groupe_name]
        self.game.players[self.user] = Player(self.user, self.game)
        if (len(self.game.players) == 2):
            await self.set_game_status()

    @database_sync_to_async
    def set_game_status(self):
        game = GameModel.objects.filter(id=self.id).first()
        game.status = 'START'
        game.save()
        
    @database_sync_to_async
    def user_has_access(self):
        players = [self.game_db.player_1.get_username(), self.game_db.player_2.get_username()]
        if self.player.get_username() not in players:
            raise ValueError(f'Game ID {self.id} Not Is Unaccessible')

    @database_sync_to_async
    def print_game(self,game):
        print(f'Game type: {type(game)}')
        print(f'Game content: {game}')

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.groupe_name, self.channel_name
        )
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
        for p in self.game.players:
            if not p == self.channel_name:
                player2 = self.game.players[p]
        await self.send(text_data=json.dumps({
            'type': 'send_position',
            'player': player.get_data(),
            'player_two': player2.get_data(),
            'ball': {'x': str(self.game.ball.posX), 'y':str(self.game.ball.posY)},
            'id': str(player.id),
            'channel_name': self.channel_name,
        }))

    async def game_start(self):
        self.game.set_players_color()
        ball = self.game.ball
        player = self.game.players[self.channel_name]
        player2 = None
        for p in self.game.players:
            if not p == self.channel_name:
                player2 = self.game.players[p]     
        fps = 1/60
        while True:
            try:
                ball.update()
                player.update(self.game)
                player2.update(self.game)
                await self.channel_layer.group_send(self.groupe_name,
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
        return game