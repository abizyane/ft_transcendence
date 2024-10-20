from room_manager import *
from abc import ABC, abstractmethod

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
        self.room:Room = None
        self._type = ''
    """
        Comptitor should ask manager for Type of Tournament He wanna join
        1/2, 1/4, 1/8 , manager will search for type of room if available
        if Not create a new Room of desired type
    """
    def join_room(self, room:Room) -> Room:
        return room.add_player(self)

    def exit_room(self, room:Room) -> None:
        room.remove_player(self)

    def set_compition_type(self, _type:str):
        self._type = _type

    def room_request(self, rm:AbstractRoomManager) -> Room:
        if not self._type :
            raise ValueError("Type Not Defined")
        self.room = rm.get_not_ready(self._type)
        if not self.room :
            self.room = rm.create_room(self._type)
            return self.room
        return self.room[0]
