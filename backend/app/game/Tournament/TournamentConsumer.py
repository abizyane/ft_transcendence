from notification.models import Notifications
from channels.generic.websocket import AsyncWebsocketConsumer
from .tournament_utils import RoomManagerNew
from .competitor import CompetitorNamed,Room
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
from enum import Enum
from ..models import GameInvite, Profile, GameModel, Scores, TournamentModel
from .room_restrict import RoomRestriction, RoomIsEmpty
from .alias_restrict import AliasException, NoAlias, AliasAlreadyUsed
from astropong.serializers.UserSerializer import UserSerializer
from chat.models import Message
from chat.serializers import MessageConsumerSerializer

def is_image_url(url):
    return url.startswith("http") or url.startswith("https")

def build_absolute_image_uri(scope, relative_path):
    host = dict(scope['headers']).get(b'host', b'localhost').decode('utf-8')
    scheme = scope.get('scheme', 'http')
    base_url = f"{scheme}://{host}"
    if relative_path is None:
        return urljoin(base_url, settings.MEDIA_URL + "Profil.jpg")
    if is_image_url(relative_path):
        return relative_path
    return urljoin(base_url,settings.MEDIA_URL + relative_path)

class Command(Enum):
    CREATE = 1
    JOIN = 2
    LEAVE = 3
    INPUT = 4
    JOINRANDOM = 5
    PLAY = 6
    ALIAS = 7
    SETIMAGE = 8

class TournamentConsumer(AsyncWebsocketConsumer):
    rm = RoomManagerNew()
    rooms = {}
    connected_users = set()
    i = 0
    _id = 0
    def set_competitor_info(self,username, img, userId):
        self.p_holder.competitor.username = username
        self.p_holder.competitor.img = img
        self.p_holder.competitor.user_id = userId
        self.p_holder.competitor._id = userId

    @database_sync_to_async
    def check_token(self, token):
        try:
            game_invite = GameInvite.objects.get(token=token)
            # try:
            #     notif = Notifications.objects.get(link=f"/game/solo/maps?game=randommatch&token={token}")
            #     notif.link = None
            #     notif.save()
            # except Notifications.DoesNotExist:
            #     pass
            return game_invite.status == GameInvite.Status.PENDING
        except GameInvite.DoesNotExist:
            return False
    
    @database_sync_to_async
    def change_token_status(self, token, status):
        try:
            game_invite = GameInvite.objects.get(token=token)
            game_invite.status = status
            game_invite.save()
            return True
        except GameInvite.DoesNotExist:
            return False
    
    async def connect(self):
        self.user = None
        self.alias = None
        user = self.scope['user']
        if user.is_anonymous or not user.is_authenticated:
            await self.accept()
            await self.send(text_data=json.dumps({
                "msg" : f"{user} is not authenticated.",
                "type" : "error"
            }))
            await self.close()
            return
        
        # if user.username in TournamentConsumer.connected_users :
        #     await self.accept()
        #     await self.send(text_data=json.dumps({
        #         "msg" : f"{user} user already connected.",
        #         "type" : "error"
        #     }))
        #     await self.close()
        #     return
        # TournamentConsumer.connected_users.add(user.username)
        await self.accept()
        self.p_holder = PlayerHolder(CompetitorNamed(self.channel_name))
        self.set_competitor_info(username=user.username, img=build_absolute_image_uri(self.scope, user.profile_pic), userId=user.id)
        self.competitor = self.p_holder.competitor
        self._type = self.scope['url_route']['kwargs']['competition_type']
        if self._type == "FOUR" :
            await self.channel_layer.group_add("FOUR", self.channel_name)
            await self.channel_layer.group_send("FOUR", {
                'type' : 'broadcast.allrooms.state'
            })
        self.user = user
        self.room:Room = None
        self.match = None
        self.match_name = ''
        self.task = None
        self.game = None
        self.state = ''
        self.competitor.set_competition_type(self._type)
        if self._type == "TWO":
            token = None
            if self.scope['query_string'] is not None:
                if self.scope['query_string'].decode().split('=')[0] == 'token':
                    token = self.scope['query_string'].decode().split('=')[1]
                    if token == "":
                        token = None
            if token is not None and not await self.check_token(token):
                await self.send(text_data=json.dumps({
                    "msg" : f"Token is invalid or expired",
                    "type" : "error"
                }))
                await self.close()
                return
            self.room = await TournamentConsumer.rm.getrandom_or_create(_type=self._type, token=token)
            self.competitor.join_room(self.room)
            print('l'+self.room.name+'l', flush=True)
            await self.channel_layer.group_add(self.room.name, self.channel_name)
            await self.channel_layer.group_send(self.room.name, {
                'type' : 'joined.competitor'
            })
            self.room.p_holders[self.channel_name] = self.p_holder
            if self.room.is_ready() :
                self.competitor.is_host = True
                if self.room.token is not None:
                    await self.change_token_status(self.room.token, GameInvite.Status.ACCEPTED)
                await self.play()

    @database_sync_to_async
    def create_message(self, opponent):
        message = Message.objects.create(
                sender_id=self.room.get_room_host()['id'],
                receiver_id=self.competitor.user_id,
                message=f"A tournament match vs {opponent.competitor.alias} is starting now",
                notification=True
            )
        serialized_message = MessageConsumerSerializer(message).data
        return serialized_message
    
    async def init_game(self, event):
        try :
            self.match = self.room.tournament.get_player_match(self.channel_name)
            self.match_name = str(f'{self.room.name}m_{self.match.index}')
        except Exception as e :
            print(f'Exception sor {self.competitor.alias}', flush=True)
            print(f'{self.channel_name}', flush=True)
        await self.channel_layer.group_add(self.match_name, self.channel_name)
        if not self.match.game and ((self.p_holder.index % 2) == 0):
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
            players = {
                "player_1" : {"username":self.competitor.alias, "img":self.competitor.img },
                "player_2" : {"username":opponent.competitor.alias, "img":opponent.competitor.img}
            }
            if self._type == "FOUR":
                serialized_message = await self.create_message(opponent)
                await self.channel_layer.group_send(
                    "chat_room",
                    {
                        'type': 'chat_message',
                        'message': serialized_message,
                        'sender': self.room.get_room_host()['username'],
                        'receiver': self.competitor.username,
                        'sender_id': self.room.get_room_host()['id'],
                        'receiver_id': self.competitor.user_id
                    }
                )
            self.match.game.init_paddle_pos()
            await self.channel_layer.group_send(self.match_name,{
                'type' : 'init.match',
                'msg' : self.match_name,
                'players' : players
            })
            
    async def call_game(self):
        self.task = asyncio.create_task(self.game_loop())

    async def init_match(self, event):
        self.game = self.match.game
        players = event.get('players')
        await self.send(text_data=json.dumps({
            'type' : 'match_players',
            'players' : players
        }))
        for i in range(5, 0, -1):
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
            self.room.winners.append(self.competitor)
            # await self.award_xp(True)

            await self.send(text_data=json.dumps({
                'msg': 'You Won'
            }))
            await self.channel_layer.group_send(self.room.name,{
                'type' : 'broadcast.room.state'
            })
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
            # await self.channel_layer.group_send(self.room.name,{
            #     'type' : 'broadcast.room.state'
            # })
        else:
            # self.p_holder.paddle = None
            # await self.award_xp(False)
    
            await self.send(text_data=json.dumps({
                'msg': 'You Lost'
            }))
            await self.channel_layer.group_send(self.room.name,{
                'type' : 'broadcast.room.state'
            })
        rm = None
       
        

    async def room_update(self, event):
        await self.send(text_data=json.dumps({
            'type' : 'room',
            'command' : 'wait',
            'competitors' : self.p_holder.competitor.get_allroom_info()
        }))

    async def newgame_request(self, event):
        await self.send(text_data=json.dumps({
            'debuf' : f'{self.match_name}'
        }))
        for i in range(3,0,-1):
            await self.send(json.dumps({
                'cooldown_timer': str(i)
            })) 
            await asyncio.sleep(1)
        # await self.send(text_data=json.dumps({
        #     'type': 'room',
        #     'command' : 'setReady'
        # }))
        await self.channel_layer.group_send(self.match_name, {
            'type' : 'init.game'
        })

    async def send_pos(self, event):
        float_list = [self.game.blue.x, self.game.blue.y, self.game.red.x, self.game.red.y, self.game.ball.posX, self.game.ball.posY, self.game.blue.score, self.game.red.score]
        f_arr = np.array(float_list, dtype=np.float32).tobytes()
        await self.send(bytes_data=f_arr)
    
    async def joined_competitor(self, event):
        comp_info = self.competitor.get_allroom_info()
        await self.send(text_data=json.dumps({
            "type" : "room",
            "competitors" : comp_info,
            "command" : "setCompetitors"
        }))
        

    async def disconnect(self, error_code):
        if self.alias :
            TournamentConsumer.rm.aliases.remove(self.alias)
        # if self.user:
            # TournamentConsumer.connected_users.remove(self.user.username)
        if self.room:
            if  self.room.started :
                #set other player to winner
                if self.match and self.match.is_ready():
                    await self.channel_layer.group_send(self.match_name, {
                        'type' : 'leave.state',
                        'player' : f'{self.channel_name}'
                    })
                    await self.channel_layer.group_send(self.match_name,{
                        'type' : 'room.update',
                    })

            try:
                self.p_holder.competitor.exit_room(self.room)
                self.room.competitors[0].is_host = True
                # del self.room.tournament.p_holders[self.channel_name]
            except RoomIsEmpty as e:
                TournamentConsumer.rm.remove_room(self._type, self.room.name)
            if self._type == "FOUR":
                await self.channel_layer.group_send("FOUR", {
                    'type' : 'broadcast.allrooms.state'
                })
                
                await self.channel_layer.group_discard("FOUR", self.channel_name)
            await self.channel_layer.group_discard(self.room.name, self.channel_name)

    def access_competition(self, competitor:CompetitorNamed) -> None :
        competitor.set_competition_type(self._type)
        self.room = competitor.room_request(TournamentConsumer.rm)
        competitor.join_room(self.room)
    
    def command_switch(self,command) -> int:
        return (Command.CREATE.value * int(command == "create") + 
                Command.SETIMAGE.value * int(command == "set_image") +
                Command.JOIN.value * int(command == "join") +
                Command.LEAVE.value * int(command == "leave") +
                Command.INPUT.value * int(command == "input") +
                Command.JOINRANDOM.value * int(command == "join_random") +
                Command.PLAY.value * int(command == "play") +
                Command.ALIAS.value * int(command == "setAlias")
                )

    async def create_room(self,data):
        name = data.get('roomName')
        try :
            self.room = await self.competitor.create_room(TournamentConsumer.rm, _type=self._type, name=name, image_id=data.get('roomImage', None), scope=self.scope)
            self.competitor.join_room(self.room)
            await self.channel_layer.group_add(name, self.channel_name)
            await self.send(text_data=json.dumps({
                'InformMsg' : f'Room {name} created successfuly'
            }))
            self.competitor.is_host = True
            self.room.p_holders[self.channel_name] = self.p_holder
            if self._type == "FOUR":
                await self.channel_layer.group_send("FOUR", {
                    'type' : 'broadcast.allrooms.state',
                })
                await self.send(text_data=json.dumps({
                    'approving' : True,
                    'room' : self.room.get_data()
                }))
                await self.channel_layer.group_send(self.room.name, {
                'type' : 'joined.competitor'
            })
        except RoomRestriction as e:
            await self.send(text_data=json.dumps({
                'ErrorMsg' : str(e)
            }))
        except TypeError as te :
            await self.send(text_data=json.dumps({
                'ErrorMsg' : str(te)
            }))
            self.competitor.exit_room(self.room)
            TournamentConsumer.rm.remove_room(self._type, self.room.name)
    
    async def broadcast_allrooms_state(self, event):
        await self.send(text_data=json.dumps({
            'type' : 'tournament_state',
            'room' : [room.get_data() for room in TournamentConsumer.rm.type_four.values()],
        }))
    
    
    async def leave_room(self):
        if self.competitor and self.room :
            try :
                self.competitor.exit_room(self.room)
                await self.group_send(self.room.name, {
                    'type' : 'left.msg',
                    'left_player' : self.competitor.username
                }) 
            except RoomRestriction as e:
                TournamentConsumer.rm.remove_room(self.room._id)
                #broadcast allrooms deletion
        else :
            await self.send(text_data=json.dumps({
                'ErrorMsg' : 'You are not in a room'
            }))

    async def left_msg(self, event):
        comp_info = self.p_holder.competitor.get_allroom_info()
        user_left = event['left_player']
        await self.send(text_data=json.dumps({
            "type" : "room",
            "msg" : f'user {left_player} has left', #alias later (!attention)
            "competitors" : comp_info,
            "command" : "setCompetitors"
        }))
        
    async def join_room(self,data):
        name = data.get('name')
        print(name, flush=True)
        try :
            room = TournamentConsumer.rm.get_room(self._type, name)
            self.room = self.competitor.join_room(room)
            await self.channel_layer.group_add(self.room.name, self.channel_name)
            await self.send(text_data=json.dumps({
                'InformMsg': f'you joined room:{self.room.name} successfuly'
            }))
            await self.channel_layer.group_send(self.room.name, {
                'type' : 'joined.competitor'
            })
            self.room.p_holders[self.channel_name] = self.p_holder
            if self._type == "FOUR":
                await self.channel_layer.group_send("FOUR", {
                    'type' : 'broadcast.allrooms.state',
                    'room' : self.room.get_data()
                })
                await self.send(text_data=json.dumps({
                    'approving' : True,
                    'room' : self.room.get_data()
                }))
            await self.channel_layer.group_send(self.room.name, {
                'type': 'ready_to_play',
                'ready': self.room.is_ready()  # or False, depending on the logic
            })
            
        except RoomRestriction as e :
            await self.send(text_data=json.dumps({
                'ErrorMsg' : str(e)
            }))
    async def ready_to_play(self, event):
        await self.send(text_data=json.dumps({
            'type': 'room',
            'command': 'readyToPlay',
            'ready': event.get('ready', False)
        }))

    async def broadcast_room_state(self, event):
        await self.send(text_data=json.dumps({
            'command' : 'update_room',
            'competitors' : self.competitor.get_allroom_info(),
            'winners' : self.room.get_winners_info()
        }))
    
    def join_random_room(self, _type):
        self.room = self.competitor.random_room_request(TournamentConsumer.rm)
        self.competitor.join_room(self.room)
    
    async def play(self):
        if self.room.is_ready() and self.competitor.is_host:
            print(list(self.room.p_holders.values()) , flush=True)
            competitors_gen = iter(list(self.room.p_holders.values()))
            self.room.holder = MatchTreeBuilder.build_tree(MatchHolder(),0, 1, competitors_gen, self.room.size)
            MatchTreeBuilder.visualize_tree(holder=self.room.holder, lvl=0, size=self.room.size)
            self.room.tournament.p_holders = self.room.p_holders
            self.room.started = True
            await self.channel_layer.group_send(self.room.name, {
                "type" : "init.game",
            })
            await self.send(text_data=json.dumps({
                'debug' : str(self.room.size),
                'msg' : str(self.room.competitors)
            }))
        else :
            await self.send(text_data=json.dumps({
                'ErrorMsg' : "Game Not Ready Yet"
            }))
    
    async def setAlias(self, recv_data):
        alias = recv_data.get('alias')
        try :
            if not alias:
                raise NoAlias
            if alias in TournamentConsumer.rm.aliases :
                raise AliasAlreadyUsed
            TournamentConsumer.rm.aliases.add(alias)
            self.alias = alias
            self.competitor.alias = alias
            await self.send(text_data=json.dumps({
                'type' : 'alias',
                'accepted' : True,
                'alias' : alias
            }))
        except AliasException as e :
            await self.send(text_data=json.dumps({
                'type' : 'alias',
                'ErrorMsg' : str(e)
            }))
    
    async def set_image(self, recv_data, scope):
        image_id = recv_data.get('image_id')
        if self.room:
            self.room.set_image(image_id, scope)
        else :
            await self.send(text_data=json.dumps({
                'ErrorMsg' : "You are not in a room"
            }))
    
    def handle_input(self, data):
        input_key = data.get('type')
        if input_key == "keyW_up" :
            self.p_holder.paddle.isW = True
        elif input_key == "keyW_down" :
            self.p_holder.paddle.isW = False
        elif input_key == "keyS_up" :
            self.p_holder.paddle.isS = True
        elif input_key == "keyS_down" :
            self.p_holder.paddle.isS = False

        
    async def receive(self, text_data):
        recv_data = json.loads(text_data)
        command = recv_data.get('command')

        match self.command_switch(command) :
            case Command.CREATE.value :
                print(command, flush=True)
                await self.create_room(recv_data)
            case Command.SETIMAGE.value :
                await self.set_image(recv_data, self.scope)
            
            case Command.JOIN.value :
                await self.join_room(recv_data)

            case Command.LEAVE.value :
                await self.leave_room()
            
            case Command.JOINRANDOM :
                await self.join_random_room()
        
            case Command.INPUT.value :
                self.handle_input(recv_data)
    
            case Command.PLAY.value :
                await self.play()
            
            case Command.ALIAS.value :
                await self.setAlias(recv_data)
    
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