from abc import ABC,abstractmethod
from .room import *
from enum import Enum
from .roomlister import RoomLister

RoomType = Enum('RoomType', ['TWO', 'FOUR', 'EIGHT'])

RoomTypes = {
    "TWO": "TwoPlayersRoom",
    "FOUR": "FourPlayersRoom"
}
RM_TYPE = {
    2: "TWO",
    4: "FOUR"
}

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

    _id = 0
    def __init__(self):
        super().__init__()
        self.not_ready = RoomLister()
        self.ready = RoomLister()
        self.names = {4:{}}

    def name_handle(self, _type, name):
        if _type == RM_TYPE[4] and not name:
            raise MustHaveName
        if name in self.names[4]:
            raise UsedName(name)
        if name:
            self.names[4].add(name)
 
    def create_room(self, _type, name=None):
        try:
            self.name_handle(_type=type, name=name)
            new_room = super().create_room(_type)
            self.not_ready.append(new_room)
            self.naming_room(new_room, name=name)
            return new_room
        except Exception as e :
            raise
    
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

    def naming_room(self, room:Room, name=None):
        room.name =  name if name else f'room_{RoomListManager.RoomTypes[ RoomListManager.RM_TYPE[room.size] ]}.{RoomListManager._id}'

    class MustHaveName(Exception):
        def __init__(self):
            super().__init__(message="Name Your Room")
        
    class UsedName(Exception):
        def __init__(self, name:str):
            super().__init__(message=f'the room name: {name} already exist please change the room name')


class RoomManagerNew(RoomManager):
    def __init__(self):
        self.type_four_name = {4:set()}
        self.type_two = {}
        self.type_four = {}
        self.type_two_id = 0
    
    def create_type_two_room(self):
        room = self.type_two[self.type_two_id] = self.generate_room(RM_TYPE[2])
        self.type_two_id += 1
        return room

    def create_type_four_room(self, name):
        if not name:
            raise RoomManagerNew.MustHaveName
        if name in self.type_four_name[4]:
            raise RoomNameAlreadyExist(name)
        self.type_four_name[4].add(name)
        self.type_four[name] = self.generate_room(RM_TYPE[4])
        return self.type_four[name]


    def create_room(self, _type:str, name):
        if _type == RM_TYPE[2]:
            return self.create_type_two();
        elif _type == RM_TYPE[4] :
            return self.create_type_four_room(name)

    def get_room(self, room_name):
        if not room_name :
            raise RoomRequestNameRequired()
        if room_name not in self.type_four_name[4]:
            raise RoomNotExist(room_name)
        return self.type_four[name]
    
    """
    remove tournament name and tournament
    """
    def remove_tpye_four_room(self, room_name):
        self.type_four_name[4].remove(name)
        del self.type_four[name]

    def remove_type_two_room(self, room_id):
        del self.type_two[room_id]
    
    class RoomRestriction(Exception):
        def __init__(self, message=None):
            super().__init__(message)
        pass
    
    class MustHaveName(RoomRestriction):
        def __init__(self, message="Name Your Room"):
            super().__init__(message)
        
    class RoomNameAlreadyExist(RoomRestriction):
        def __init__(self, name:str):
            super().__init__(message=f'the room name: {name} already exist please change the room name')
    
    class RoomNotExist(RoomRestriction):
        def __init__(self, name):
            super().__init__(message=f'room with name: {name} do not exist')

    class RoomRequestNameRequired(RoomRestriction):
        def __init__(self, message="Joining a room required a name"):
            super().__init__(message)