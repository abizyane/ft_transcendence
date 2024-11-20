from abc import ABC,abstractmethod
from .room import *
from enum import Enum
from .roomlister import RoomLister

RoomType = Enum('RoomType', ['TWO', 'FOUR', 'EIGHT'])

class AbstractRoomManager(ABC):
    @abstractmethod
    def get_room(self) -> Room:
        pass

    @abstractmethod    
    def create_room(self, _type) -> Room:
        pass

    @abstractmethod    
    def remove_room(self, _id) -> Room:
        pass

    @abstractmethod
    def is_empty(self, _id) -> bool:
        pass

    @abstractmethod
    def is_ready(self, _id) -> bool:
        pass

    
class RoomManager(AbstractRoomManager):
    def __init__(self):
        self.rooms = []
    #Builder Call
    def generate_room(self, _type) -> Room :
        value:int = RoomType[_type].value
        if value == 1:
            return TwoPlayersRoom()
        elif value == 2:
            return FourPlayersRoom()
        else:
            raise ValueError("No such a type")
    
    #Room LifeTime
    def create_room(self, _type) -> Room:
        new_room = self.generate_room(_type);
        self.rooms.append(new_room)
        return new_room

    def remove_room(self, _id) -> Room:
        return self.rooms.pop(_id)

    #Room State
    def is_empty(self, _id) -> bool:
        return self.rooms[_id].is_empty()

    def is_ready(self, _id) -> bool:
        return self.rooms[_id].is_ready()

    #Other Methods
    def get_room(self, _id) -> Room:
        return self.rooms[_id]

    def get_available_rooms(self, _type:str):
        return (lambda room : room.ready, self.rooms)

class RoomListManager(RoomManager):
    RoomTypes = {
        "TWO": "TwoPlayersRoom",
        "FOUR": "FourPlayersRoom"
    }
    RM_TYPE = {
        2: "TWO",
        4: "FOUR"
    }
    _id = 0
    def __init__(self):
        super().__init__()
        self.not_ready = RoomLister()
        self.ready = RoomLister()
 
    def create_room(self, _type):
        new_room = super().create_room(_type)
        self.not_ready.append(new_room)
        self.naming_room(new_room)
        return new_room
    
    def remove_ready(self, room:Room):
        self.ready.remove(room)
    
    def get_not_ready(self, _type):
        "ret [] if empty"
        not_ready = self.not_ready.get_list_type(RoomListManager.RoomTypes[_type])
        return not_ready

    def remove_not_ready(self, room:Room):
        self.not_ready.remove(room)

    def switch_to_ready(self, room:Room):
        self.ready.append(self.not_ready.remove(room))

    def naming_room(self, room:Room):
        room.name =  f'room_{RoomListManager.RoomTypes[ RoomListManager.RM_TYPE[room.size] ]}.{RoomListManager._id}'
