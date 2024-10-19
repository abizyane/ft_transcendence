from channel.generic.websocket import AsyncWebsocketConsumer
from tournament_utils import RoomManager

class TournamentConsumer(AsyncWebsocketConsumer):
    room_manager = RoomManager()
    def connect(self):
        #get_user_info
        self.accept()
        self.room = self.find_room()
        await self.join_group()
        if (self.room.is_ready()):
            self.channel_layer.group_send(self.group_name, {
                'type' : 'set_lobby_ready',
                'message_content': f'{self.group_name} ready',
                'message': 'ready'
            })
        

    def find_room(self):
        result = None
        for room in TournamentConsumer.rooms_tracking :
            if not room.is_ready()
                result = room
        if not result:
            result = Room
            TournamentConsumer.rooms_tracking.append(result)
        return result

    async def join_group(self):
        self.group_name = f'room_{self.room.id}'
        await self.channel_layer.group_add(self.channel_layer, self.group_name)

    async def set_lobby_ready(self, event):
        self.send(self.channel_name,{
            'type': 'inform',
            'message' : 'ready'
        })