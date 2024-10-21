from channel.generic.websocket import AsyncWebsocketConsumer
from tournament_utils import RoomListManager

class TournamentConsumer(AsyncWebsocketConsumer):
    rm = RoomListManager()
    rooms = {}
    _id = 0
    def connect(self):
        #get_user_info
        await self.accept()
        self.competiror = Competitor(self.channel_name)
        self.room = None
        self.access_competition(self.competitor);
        await self.channel_layer.group_add(self.channel_name, self.room.name)
        await self.channel_layer.group_send(self.room.name, {
            "type" : "joined.competitor.data",
            "competitor" : self.competitor
        })

    async def joined_player_data(self, event):
        self.send(text_data=json.dumps({
            "msg" : event[competitor].__dict__
        }))

    def disconnect(self):
        if self.room:
            if self.room.isready():
                #set other player to winner
                pass
            else :
                try:
                    self.competitor.exit_room(self.room)
                except RoomIsEmpty:
                    rm.remove_not_ready(self.room)
        #self.channel_layer.group_discard(self.group_name, self.channel_name)

    def access_competition(self, competitor:Competitor) -> None :
        # competitor.set_competition_type()
        self.room = competitor.room_request(TournamentConsumer.rm)
        competitor.join_room(self.room)
