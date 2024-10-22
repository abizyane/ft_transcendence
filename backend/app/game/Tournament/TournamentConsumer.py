from channels.generic.websocket import AsyncWebsocketConsumer
from .tournament_utils import RoomListManager
from .competitor import Competitor
import json

class TournamentConsumer(AsyncWebsocketConsumer):
    rm = RoomListManager()
    rooms = {}
    _id = 0
    async def connect(self):
        #get_user_info
        await self.accept()
        self.competitor = Competitor(self.channel_name)
        self.room = None
        self.access_competition(self.competitor);
        print(type(self.room.name))
        await self.channel_layer.group_add((self.room.name), self.channel_name)
        await self.channel_layer.group_send(self.room.name, {
            "type" : "joined.competitor.data",
            "competitor" : self.competitor.__dict__['name'],
            "currentsize" : str(self.room.players_count()),
        })
        if self.room.is_ready():
            TournamentConsumer.rm.switch_to_ready(self.room) 
            

    async def joined_competitor_data(self, event):
        await self.send(text_data=json.dumps({
            "msg" : event['competitor'],
            "size" : event['currentsize'],
        }))

    async def disconnect(self):
        if self.room:
            if self.room.isready():
                #set other player to winner
                pass
            else :
                try:
                    self.competitor.exit_room(self.room)
                except RoomIsEmpty:
                    rm.remove_not_ready(self.room)
        self.channel_layer.group_discard(self.room.name, self.channel_name)

    def access_competition(self, competitor:Competitor) -> None :
        competitor.set_competition_type("TWO")
        self.room = competitor.room_request(TournamentConsumer.rm)
        competitor.join_room(self.room)
        
