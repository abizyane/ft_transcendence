from abc import ABC,abstractmethod
from room import *
from enum import Enum

RoomType = Enum('RoomType', ['TWO', 'FOUR', 'EIGHT'])

class AbstractRoomManager(ABC):
    @abstractmethod
    def find_room(self):
        pass

    @abstractmethod    
    def create_room(self, type):
        pass

    @abstractmethod    
    def remove_room(self):
        pass

    
class RoomManager(AbstractRoomManager):
    def __init__(self):
        self.rooms = []

    def generate_room(self, _type) -> Room :
        match value:
            case 1:
                return TwoPlayersRoom()

    def create_room(self, _type) -> None:
        value = RoomType[_type].value
        new_room = generate_room(_type);
        self.rooms.append(new_room)
        pass

    def get_room(self, id) -> Room:
        return self.rooms[id]

    def find
       