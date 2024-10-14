from abc import ABC,abstractmethod
from room import *
from enum import Enum

RoomType = Enum('RoomType', ['TWO', 'FOUR', 'EIGHT'])

class AbstractRoomManager(ABC):
    @abstractmethod
    def get_room(self):
        pass

    @abstractmethod    
    def create_room(self, _type):
        pass

    @abstractmethod    
    def remove_room(self):
        pass

    @abstractmethod
    def is_empty(self, _id):
        pass

    @abstractmethod
    def is_ready(self, _id):
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