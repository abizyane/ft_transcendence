from .tournament_utils import AbstractRoomManager
from .room import Room
from abc import ABC, abstractmethod
from .room_restrict import RoomRestriction, RoomIsEmpty, RoomIsFull, AlredyJoined

class AbstractCompetitor(ABC):
    @abstractmethod
    def join_room(self, room:Room):
        pass

    @abstractmethod
    def exit_room(self, room:Room):
        pass

    @abstractmethod
    def room_request(self, rm:AbstractRoomManager):
        pass   

class Competitor(AbstractCompetitor):
    def __init__(self, name):
        self.name = name
        self._id = -1
        self.username = ''
        self.alias = ''
        self.room:Room = None
        self._type = ''
        self._state = None
        self.img = ''
        self.user_id = None
        self.islost = False
        self.is_host = False
        self.joined = False
    """
        Comptitor should ask manager for Type of Tournament He wanna join
        1/2, 1/4, 1/8 , manager will search for type of room if available
        if Not create a new Room of desired type
    """
    def join_room(self, room:Room) -> Room:
        try :
            room.add_player(self)
            self.room = room
            self.joined = True
            return room
        except RoomRestriction as e:
            raise

    def exit_room(self, room:Room) -> None:
        try :
            room.remove_player(self)
            self.joined = False
        except RoomIsEmpty as e:
            raise e

    def set_competition_type(self, _type:str):
        self._type = _type

    def room_request(self, rm:AbstractRoomManager) -> Room:
        if not self._type :
            raise ValueError("Type Not Defined")
        self.room = rm.get_not_ready(self._type)
        if not self.room :
            self.room = rm.create_room(self._type)
            return self.room
        return self.room[0]
    
    def get_data(self):
        return self.__dict__

    def get_info(self):
        return {
            'username' : self.username,
            'alias' : self.alias,
            'profile_pic_url' : self.img,
            'lost' : self.islost,
            'id' : self._id,
        }
    
    def get_allroom_info(self):
        res = []
        for competitor in (self.room.competitors) :
            res.append(competitor.get_info())
        return res
            
class CompetitorNamed(Competitor):
    def __init__(self, name):
        super().__init__(name)

    def create_room(self, rm:AbstractRoomManager, _type:str, name:str=None):
        try :
            if self.joined :
                raise AlredyJoined(self.name, self.room.name)
            self.room = rm.create_room(_type, name)
            return self.room
        except Exception as e:
           raise e 

    def room_request(self, rm:AbstractRoomManager):
        raise NotImplementedError

    def random_room_request(self, rm:AbstractRoomManager):
        if self._type == RM_TYPE[2]:
            self.room = self.room_request(rm)
        else :
            self.room = rm.get_not_ready(self._type)[0]
            if not self.room :
                raise NoRoomAvailable
        return self.room

    class NoRoomAvailable(Exception):
        def __init__(self, message="No Room available to join"):
            super().__init__(message=message)

    
