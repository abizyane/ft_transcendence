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

    @abstactmethod
    def is_ready(self, _id)
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

    def get_room(self, _id) -> Room:
        return self.rooms[_id]

    def remove_room(self, _id) -> Room:
        return self.rooms.pop(_id)

    def is_empty(self, _id) -> bool:
        return self.rooms[_id].is_empty()

    def is_ready(self, _id) -> bool:
        return self.rooms[_id].is_ready()