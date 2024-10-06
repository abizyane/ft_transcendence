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



class GameConsumer(AsyncWebsocketConsumer) :
    games = {}
    async def connect(self):
        try:
            self.id = 0
            self.user = await self.get_user()
            self.group_name = ''
            self.game_db = None
            self.game = None
            self.player, self.username = await self.get_profile()
            self.player_id
            self.action = ''
        except Exception as e:
            print(f'Error: {e}')
        await self.accept()
        await self.init_game()
        await self.init_2();

    """ GET PROFILE FROM USER"""
    @database_sync_to_async
    def get_profile(self):
        profile = Profile.objects.filter(user_id=self.user.id).first()
        return profile, profile.user_id.username
    
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
        self.action = ''
        try:
            games_list = list(GameConsumer.games.keys())
            if not games_list:
                raise GameConsumer.NoGameInQueue
            last_game_name = games_list[-1]
            last_game = GameConsumer.games.get(int(last_game_name))
            last_game.is_full()
            self.action = 'JOIN'
        except (GameConsumer.NoGameInQueue, Game.RoomIsFull):
            queue_id = len(games_list)
            # self.queue_id = queue_id
            last_game = self.create_new_game(queue_id)
            self.action = 'CREATE'
        return last_game,self.action

    def create_new_game(self,queue_id):
        GameConsumer.games[queue_id] = Game(queue_id)
        return GameConsumer.games[queue_id] 

    async def join_game(self):
        await asyncio.sleep(0)
        self.game.profiles[self.channel_name] = self.player
        self.game.players[self.channel_name] = Player(self.channel_name, len(self.game.players), self.game)

    
    async def init_game(self):
        await self.send(text_data=json.dumps({
            "type" : "send.status",
            "status" : "WAIT",
            'user': self.user.username
        }))
        self.game, self.action = self.get_last_game()
        if self.action == 'CREATE':
            self.game_db = await self.create_game()
            self.game.id = self.game_db.pk
        else:
            self.game_db = await self.add_player_game()
        self.group_name = f'game_{self.game.id}'
        
        await self.join_game()
        if self.action == 'JOIN':
            self.game.status = 1
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        
        
    async def init_2(self):
        if (self.action == 'JOIN'):
            await self.set_game_status(self.game_db,'START')
            await self.channel_layer.group_send(self.group_name,{
                'type': 'broadcast_game_start',
                'status': 'START'
            })
            await self.start_game()

    async def wait(self):
         while (len(self.game.players) != 2):
            await asyncio.sleep(0.1)
            pass

    async def broadcast_game_start(self, event):
      await self.send(text_data=json.dumps({
          'message_type': 'game_start',
          'game_id': event['status']
      }))
    @database_sync_to_async
    def add_player_game(self):
        game = GameModel.objects.get(pk=self.game.id)
        game.player_2 = self.player
        game.save()
        return game

    @database_sync_to_async
    def create_game(self):
        # ps = list(self.game.profiles.values())
        return GameModel.objects.create(player_1=self.player)

    @database_sync_to_async
    def set_game_status(self,game_db, status):
        game_db.status = status
        game_db.save()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.group_name, self.channel_name
        )
        del self.game.players[self.channel_name]

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print(text_data_json)
        msgtype = text_data_json.get('type')
        if msgtype == 'input':
            await self.player_position(text_data_json)
        if msgtype == 'start':
            await self.start_game()


    async def player_position(self, data):
        player = self.game.players[self.channel_name]
        player.isW = True if  data.get('w') == 'true' else False
        player.isS = True if data.get('s') == 'true' else False

    async def send_position(self, event):
        player = self.game.players[self.channel_name]
        player2 = None
        for p in self.game.players.keys():
            if not p == self.channel_name:
                player2 = self.game.players[p]
        await self.send(text_data=json.dumps({
            'type': 'ss',
            'player': player.get_data(),
            'player_two': player2.get_data(),
            'ball': {'x': str(self.game.ball.posX), 'y':str(self.game.ball.posY)},
            'id': str(player.id),
            'channel_name': self.channel_name,
        }))

    async def start_game(self):
        await self.channel_layer.group_send(self.group_name,{
                'type': 'send_position',
                'status': 'START'})
        players = []
        players = list(self.game.players.values())
        print(players)
        players[0].color = 'blue'
        players[1].color = 'red'
        self.game.set_players_color()
        ball = self.game.ball
        player = self.game.players[self.channel_name]
        player2 = None
        self.game.status = 1
        for p in self.game.players.keys():
            if not p == self.channel_name:
                player2 = self.game.players[p]
        self.task = asyncio.create_task(self.game_loop())
        

    async def game_loop(self):
        fps = 1/144
        while self.game.status:
            try:
                self.game.update()
                self.game.update_status()
                await self.channel_layer.group_send(self.group_name, {
                  'type': 'send_position',
                  'status': 'UPDATE',
                })
                await asyncio.sleep(fps)
            except Exception as e:
                print(e)
        self.game.set_winner()
        self.channel_layer.group_send(self.group_name,{
            'type': 'game_over'
        })
    
    async def game_over(self, event):
        self.close()
        # self.send(text_data=json.dumps{})
    def finalize_game(self):
        #send End
        #set_status_ end
        self.channel_layer.group_send(self.group_name, {
          'type': 'broadcast_game_start',
          'message' : 'End'  
        })
        

    @database_sync_to_async
    def get_game_db(self):
        game = GameModel.objects.get(id=self.id)
        if not game:
            raise ValueError('Game ID False')
        self.set_game_status(game, 'WAIT')
        return game
    
    

    class NoGameInQueue(Exception):
        pass
    



class TournamentConsumer(AsyncWebsocketConsumer):
    rooms = []
    def connect(self):
        #get_user_info
        self.accept()
        self.room = self.find_room()

    def find_room(self):
        result = None
        for room in TournamentConsumer.rooms :
            if not room.is_ready()
                result = room
        if not result:
            result = Room
            TournamentConsumer.rooms.append(result)
        return result
