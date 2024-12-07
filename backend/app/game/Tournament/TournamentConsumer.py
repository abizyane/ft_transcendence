from channels.generic.websocket import AsyncWebsocketConsumer
from .tournament_utils import RoomListManager
from .competitor import Competitor,Room
import json
from .matchHolder import MatchTreeBuilder, MatchHolder, PlayerHolder
import asyncio
from urllib.parse import urljoin
from django.conf import settings
from .tournament import Tournament
from ..game_utils import Game, Player
import gc
import numpy as np
from channels.db import database_sync_to_async

from ..models import Profile, GameModel, Scores, TournamentModel
from astropong.serializers.UserSerializer import UserSerializer

def build_absolute_image_uri(scope, relative_path):
    host = dict(scope['headers']).get(b'host', b'localhost').decode('utf-8')

    scheme = scope.get('scheme', 'http')

    base_url = f"{scheme}://{host}"
    if relative_path is None:
        return urljoin(base_url, settings.MEDIA_URL + "Profil.jpg")
    return urljoin(base_url, relative_path)
class TournamentConsumer(AsyncWebsocketConsumer):
    rm = RoomListManager()
    connected_users = set()
    rooms = {}
    i = 0
    _id = 0
    def set_competitor_info(self,username, img, userId):
        self.p_holder.competitor.username = username
        self.p_holder.competitor.img = img
        self.p_holder.competitor.user_id = userId
    
    async def connect(self):
        self.user = None
        user = self.scope['user']
        if user.is_anonymous or not user.is_authenticated:
            await self.accept()
            await self.send(text_data=json.dumps({
                "msg" : f"{user} is not authenticated.",
                "type" : "error"
            }))
            await self.close()
            return
        
        if user.username in TournamentConsumer.connected_users :
            await self.accept()
            await self.send(text_data=json.dumps({
                "msg" : f"{user} user already connected.",
                "type" : "error"
            }))
            await self.close()
            return
            
        await self.accept()
        self.user = user
        TournamentConsumer.connected_users.add(self.user.username)
        self.p_holder = PlayerHolder(Competitor(self.channel_name))
        self.set_competitor_info(username=user.username, img=build_absolute_image_uri(self.scope, user.profile_pic), userId=user.id)
        self._type = self.scope['url_route']['kwargs']['competition_type']
        self.game_mode = "tournament" if self._type == "tournament" else "1v1"
        self.room:Room = None
        self.match = None
        self.match_name = ''
        self.task = None
        self.game = None
        self.state = ''
        self.access_competition(self.p_holder.competitor);
        self.room.tournament.p_holders[self.channel_name] = self.p_holder
        await self.channel_layer.group_add((self.room.name), self.channel_name)
        await self.channel_layer.group_send(self.room.name, {
            "type" : "joined.competitor",
        })
        if self.room.is_ready():
            TournamentConsumer.rm.switch_to_ready(self.room)
            competitors_gen = iter(list(self.room.tournament.p_holders.values()))
            self.room.holder = MatchTreeBuilder.build_tree(MatchHolder(),0, 1, competitors_gen, self.room.size)
            MatchTreeBuilder.visualize_tree(holder=self.room.holder, lvl=0, size=self.room.size)
            await self.channel_layer.group_send(self.room.name, {
                "type" : "init.game",
            })
            print(self.match)
    
    async def init_game(self, event):
        self.match = self.room.tournament.get_player_match(self.channel_name)
        self.match_name = str(f'{self.room.name}m_{self.match.index}')
        await self.channel_layer.group_add(self.match_name, self.channel_name)
        if not self.match.game:
            self.match.game = Game(self.match.index)
            self.p_holder.paddle = Player(channel_name=self.channel_name, id=self.p_holder.index ,game=self.match.game)  
            opponent = self.match.get_opponent(self.p_holder)
            opponent.paddle = Player(channel_name=opponent.get_name(), id=opponent.index, game=self.match.game)
            self.match.game.players = self.match.get_players()
            self.p_holder.paddle.color = 'blue'
            opponent.paddle.color = 'red'
            #Error Occure This Part 
            self.match.game.blue = self.p_holder.paddle
            self.match.game.red = opponent.paddle
            self.match.game.players[self.channel_name] = self.p_holder.paddle
            self.match.game.players[opponent.get_name()] = opponent.paddle
            #*** Temporary Fixed This Way ***#

            self.match.game.init_paddle_pos()
            await self.channel_layer.group_send(self.match_name,{
                'type' : 'init.match',
                'msg' : self.match_name
            })
            
    async def call_game(self):
        self.task = asyncio.create_task(self.game_loop())

    async def init_match(self, event):
        self.game = self.match.game
        for i in range(1,4):
            await self.send(json.dumps({
                'timer': str(i)
            })) 
            await asyncio.sleep(1)
        await self.send(text_data=json.dumps({
            'type' : 'room',
            'command' : 'setReady'
        }))
        if self.p_holder.index % 2 != 0 :
            await self.call_game()

    async def game_loop(self):
        while not self.game.status:
            await asyncio.sleep(1/40)
            self.game.update()
            self.game.update_status()
            await self.channel_layer.group_send(self.match_name, {
                'type' : 'send.pos'
            })
        self.game.status = 1
        print(self.match.state)
        await self.channel_layer.group_send(self.match_name,{
            'type' : 'finalize.match'
        })

    async def finalize_match(self, event):
        if not self.game.status == 1 :
            return
        if not self.match.state == "LEAVE" :
            print(self.match.state)
            self.match.game.set_winner()

        prev_match_name  = self.match_name

        # self.game = None
        if self.p_holder.index % 2 != 0 :
            self.task.cancel()

        if self.p_holder.is_won():
            await self.save_game()

            await self.award_xp(True)

            await self.send(text_data=json.dumps({
                'msg': 'You Won'
            }))
            # self.p_holder.paddle = None
            try :
                self.p_holder.upgrade() # if err mean he won
                gc.collect()
                await self.channel_layer.group_send(prev_match_name,{
                    'type' : 'room.update',
                })
                self.match = self.room.tournament.get_player_match(self.channel_name)
                self.match_name = str(f'{self.room.name}m_{self.match.index}')
                #send room state to every one in match
                #
                await self.channel_layer.group_add(self.match_name, self.channel_name)
                if self.p_holder.back.is_ready():
                    await self.channel_layer.group_send(self.match_name, {
                        'type' : 'newgame.request'
                    })
                    await self.channel_layer.group_discard(prev_match_name, self.channel_name)
                else :
                    await self.send(text_data=json.dumps({
                        'msg': f'wait for {self.match_name} to strat'
                    }))
            except:
                await self.channel_layer.group_send(prev_match_name,{
                    'type' : 'room.update',
                })
                await self.send(text_data=json.dumps({
                    'msg': 'You Won'
                }))
        else:
            # self.p_holder.paddle = None
            await self.award_xp(False)

            await self.send(text_data=json.dumps({
                'msg': 'You Lost'
            }))
        rm = None
       
        

    async def room_update(self, event):
        await self.send(text_data=json.dumps({
            'type' : 'room',
            'command' : 'wait',
            'competitorsInfo' : self.p_holder.competitor.get_allroom_info()
        }))

    async def newgame_request(self, event):
        await self.send(text_data=json.dumps({
            'debuf' : f'{self.match_name}'
        }))
        for i in range(1,4):
            await self.send(json.dumps({
                'timer': str(i)
            })) 
            await asyncio.sleep(1)
        await self.send(text_data=json.dumps({
            'type': 'room',
            'command' : 'setReady'
        }))
        await self.channel_layer.group_send(self.match_name, {
            'type' : 'init.game'
        })

    async def send_pos(self, event):
        float_list = [self.game.blue.x, self.game.blue.y, self.game.red.x, self.game.red.y, self.game.ball.posX, self.game.ball.posY, self.game.blue.score, self.game.red.score]
        f_arr = np.array(float_list, dtype=np.float32).tobytes()
        await self.send(bytes_data=f_arr)
    
    async def joined_competitor(self, event):
        comp_info = self.p_holder.competitor.get_allroom_info()
        await self.send(text_data=json.dumps({
            "type" : "room",
            "competitors" : comp_info,
            "command" : "setCompetitors"
        }))
        

    async def disconnect(self, error_code):
        if self.user:
            TournamentConsumer.connected_users.remove(self.user.username)
        if self.room:
            if  self.room.is_ready():
                #set other player to winner
                if self.match and self.match.is_ready():
                    try:
                        self.p_holder.competitor.exit_room(self.room)
                    # del self.room.tournament.p_holders[self.channel_name]
                    except self.room.RoomIsEmpty:
                        TournamentConsumer.rm.remove_not_ready(self.room)
                    await self.channel_layer.group_send(self.match_name, {
                        'type' : 'leave.state',
                        'player' : f'{self.channel_name}'
                    })
                pass
            else :
                try:
                    self.p_holder.competitor.exit_room(self.room)
                    # del self.room.tournament.p_holders[self.channel_name]
                except self.room.RoomIsEmpty:
                    TournamentConsumer.rm.remove_not_ready(self.room)
        await self.channel_layer.group_discard(self.room.name, self.channel_name)

    def access_competition(self, competitor:Competitor) -> None :
        competitor.set_competition_type(self._type)
        self.room = competitor.room_request(TournamentConsumer.rm)
        competitor.join_room(self.room)
        
    async def receive(self, text_data):
        recv_data = json.loads(text_data)
        if self.p_holder.paddle :
            self.p_holder.paddle_command(recv_data['command'])
    
    async def leave_state(self, event):
        self.match.state = "LEAVE"
        self.p_holder.paddle.win_state = "WIN"
        await self.send(text_data=json.dumps({'msg' : f'{event["player"]} is left'}))
        self.game.status = 1
    
    @database_sync_to_async
    def save_game(self):
        curr_player = Profile.objects.get(
            user_id=self.p_holder.competitor.user_id
        )
        opponent = Profile.objects.get(
            user_id=self.match.get_opponent(self.p_holder).competitor.user_id
        )

        if self.p_holder.paddle.color == 'blue':
            player_1, player_2 = curr_player, opponent
            score_1, score_2 = self.game.blue.score, self.game.red.score
        else:
            player_1, player_2 = opponent, curr_player
            score_1, score_2 = self.game.red.score, self.game.blue.score

        game = GameModel.objects.create(
            player_1=player_1,
            player_2=player_2,
            status='done'
        )

        Scores.objects.create(
            game_id=game,
            score_1=score_1,
            score_2=score_2
        )


    @database_sync_to_async
    def award_xp(self, won: bool):
        curr_player = Profile.objects.get(
            user_id=self.p_holder.competitor.user_id
        )

        xp = 100
        if self.game_mode == 'bot':
            pass
        elif won:
            xp = xp * 3 if self.game_mode == 'tournament' else xp * 1.5
            xp += self.game.blue.score * 20 if self.p_holder.paddle.color == 'blue' else self.game.red.score * 20
        else:
            xp /= 2
            xp += self.game.blue.score * 10 if self.p_holder.paddle.color == 'blue' else self.game.red.score * 10

        curr_player.increment_xp(xp)