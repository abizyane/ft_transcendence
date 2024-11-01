from channels.generic.websocket import AsyncWebsocketConsumer
from .tournament_utils import RoomListManager
from .competitor import Competitor
import json
from .matchHolder import MatchTreeBuilder, MatchHolder, PlayerHolder
import asyncio
from .tournament import Tournament
from ..game_utils import Game, Player

class TournamentConsumer(AsyncWebsocketConsumer):
    rm = RoomListManager()
    rooms = {}
    i = 0
    _id = 0
    async def connect(self):
        #get_user_info
        await self.accept()
        self.p_holder = PlayerHolder(Competitor(self.channel_name))
        self._type = self.scope['url_route']['kwargs']['competition_type']
        self.room = None
        self.match = None
        self.match_name = ''
        self.task = None
        self.access_competition(self.p_holder.competitor);
        self.room.tournament.p_holders[self.channel_name] = self.p_holder
        await self.channel_layer.group_add((self.room.name), self.channel_name)
        await self.channel_layer.group_send(self.room.name, {
            "type" : "joined.competitor.data",
            "competitor" : self.p_holder.competitor.__dict__['name'],
            "currentsize" : str(self.room.competitors_count()),
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
            self.match.game.set_players_color()
            await self.channel_layer.group_send(self.match_name,{
                'type' : 'init.match',
                'msg' : self.match_name
            })
        self.game = self.match.game

    async def init_match(self, event):
        await self.send(text_data=json.dumps(
            {
                'ss' : 'ss',
                'm': event['msg']
            }
        )
        )
        task = asyncio.create_task(self.game_loop())

    async def game_loop(self):
        while not self.game.status:
            self.game.update()
            self.game.update_status()
            await asyncio.sleep(1/60)
            await self.channel_layer.group_send(self.match_name, {
                'type' : 'send.pos'
            })
        await self.channel_layer.group_send(self.match_name,{
            'type': 'finalize.match'
        })
    
    """
        -   set loser , set winner
        -   leave old match group
        -   upgrade winner
        -   eliminate loser 
        -   check if actual match winner if its ready if its not automatticaly next winner will check it 
    """
    async def finalize_match(self, event):
        if self.task:
            self.task.cancel(self.match.task)
        self.channel_layer.group_discard(self.match_name, self.channel_name)
        self.match.game.set_winner()
        if self.p_holder.is_won():
            await self.send(text_data=json.dumps({
                'msg': 'You Won'
            }))
            self.p_holder.upgrade() # if err mean he won
            self.match = self.room.tournament.get_player_match(self.channel_name)
            self.match_name = str(f'{self.room.name}m_{self.match.index}')
            self.channel_layer.group_add(self.match_name, self.channel_name)
            if self.p_holder.back.is_ready():
                await self.send(text_data=json.dumps({
                    'msg' : 'ready',
                    'msg' : f'{self.match_name}'
                }))
                # await self.channel_layer.group_send(self.match_name, {
                #     'type': 'init.game'
                # })
            else :
                self.send(text_data=json.dumps({
                    'msg': f'wait for {self.match_name} to strat'
                }))
        else:
            await self.send(text_data=json.dumps({
                'msg': 'You Lost'
            }))
                
                
            

    async def send_pos(self, event):
        await self.send(text_data=json.dumps({
            'ball': f'{self.game.ball.posX} {self.game.ball.posY}',
            'score': f'{self.p_holder.paddle.score}',
            'score_2': f'{self.match.get_opponent(self.p_holder).paddle.score}'
        }))
    
    async def joined_competitor_data(self, event):
        await self.send(text_data=json.dumps({
            "msg" : event['competitor'],
            "size" : event['currentsize'],
        }))

    async def disconnect(self, error_code):
        if self.room:
            if self.room.is_ready():
                #set other player to winner
                if self.match.is_ready():
                    self.match.game.state = 1
                    self.room.tournament.get_player_opponent(self.channel_name).win_state = "WIN"
                    self.channel_layer.group_send(self.match_name,{
                        'type' : 'left.game',
                        'msg' : f'{self.p_holder.get_name()} left the game'
                    })
                    await self.channel_layer.group_send(self.match_name,{
                        'type': 'finalize.match'
                    })
                pass
            else :
                try:
                    self.p_holder.competitor.exit_room(self.room)
                    del self.room.tournament.p_holders[self.channel_name]
                except self.RoomIsEmpty:
                    TournamentConsumer.rm.remove_not_ready(self.room)
        self.channel_layer.group_discard(self.room.name, self.channel_name)

    def access_competition(self, competitor:Competitor) -> None :
        competitor.set_competition_type(self._type)
        self.room = competitor.room_request(TournamentConsumer.rm)
        competitor.join_room(self.room)
        
    async def receive(self, text_data):
        recv_data = json.loads(text_data)
        if self.paddle :
            self.p_holder.paddle_command(recv_data['command'])
        