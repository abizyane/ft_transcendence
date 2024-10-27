from channels.generic.websocket import AsyncWebsocketConsumer
from .tournament_utils import RoomListManager
from .competitor import Competitor
import json
from .matchHolder import MatchTreeBuilder, MatchHolder, PlayerHolder
import asyncio

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
        self.access_competition(self.p_holder.competitor);
        self.room.p_holders.append(self.p_holder)
        await self.channel_layer.group_add((self.room.name), self.channel_name)
        await self.channel_layer.group_send(self.room.name, {
            "type" : "joined.competitor.data",
            "competitor" : self.p_holder.competitor.__dict__['name'],
            "currentsize" : str(self.room.competitors_count()),
        })
        if self.room.is_ready():
            TournamentConsumer.rm.switch_to_ready(self.room)
            competitors_gen = iter(self.room.p_holders)
            print(self.room.competitors)
            self.room.holder = MatchTreeBuilder.build_tree(MatchHolder(),0, 1, competitors_gen, self.room.size)
            MatchTreeBuilder.visualize_tree(holder=self.room.holder, lvl=0, size=self.room.size)
            await self.channel_layer.group_send(self.room.name, {
                "type" : "init.game"
            })
            
                # self.match.game = Game(self.match.index)
            # self.task = asyncio.create_task()
            # check each leaf and leaf +1 back room set match to ready
            # add player[i] and i + 1 to group name `self.room.name+Match_index`
            # in match holder constuct game , constract players for Competitors
            # create a task to run loop
             
    async def init_game(self, event):
        self.match = self.p_holder.back
        self.match_name = str(f'{self.room.name}m_{self.match.index}')
        await self.channel_layer.group_add(self.match_name, self.channel_name)
        if not self.match.game:
            print(TournamentConsumer.i)
            self.match.game = True
            TournamentConsumer.i += 1
            await self.channel_layer.group_send(self.match_name,{
                'type' : 'broadcast.send',
                'msg' : str(TournamentConsumer.i)
            })

    async def broadcast_send(self, event):
        await self.send(text_data=json.dumps({
            'msg': event['msg']
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
                pass
            else :
                try:
                    self.p_holder.competitor.exit_room(self.room)
                except self.RoomIsEmpty:
                    TournamentConsumer.rm.remove_not_ready(self.room)
        self.channel_layer.group_discard(self.room.name, self.channel_name)

    def access_competition(self, competitor:Competitor) -> None :
        competitor.set_competition_type(self._type)
        self.room = competitor.room_request(TournamentConsumer.rm)
        competitor.join_room(self.room)
        
