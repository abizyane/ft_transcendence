from tournament_utils import *
from abc import ABC, abstractmethod

class AbstractCompetitor(ABC):
    @abstractmethod
    def join_room(self):
        pass

    @abstractmethod
    def exit_room(self):
        pass

    

class Competitor(AbstractCompetitor):
    def __init__(self, name):
        self.name = Name

    """
        Comptitor should ask manager for Type of Tournament He wanna join
        1/2, 1/4, 1/8 , manager will search for type of room if available
        if Not create a new Room of desired type
    """
    def join_room(self, room:Room) -> Room:
        return room.add_player(self)

    def exit_room(self, room:Room) -> None:
        room.remove_player(self)

    def room_request(self, rm:AbstractRoomManager) -> Room:
        rm.
