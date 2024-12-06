from abc import ABC, abstractmethod 
from .tournament import Tournament
from .room_restrict import RoomIsFull, AlredyJoined, RoomIsEmpty

class RoomAbstract(ABC):
    @abstractmethod
    def add_player(self, Player):
        pass

    @abstractmethod
    def remove_player(self, Player):
        pass

    @abstractmethod
    def competitors_count(self):
        pass

    @abstractmethod
    def is_empty(self):
        pass

    @abstractmethod
    def is_ready(self):
        pass

    pass

class Room(RoomAbstract):
    def __init__(self, size):
        self.competitor_id = 0
        self.size = size
        self.name = ''
        self.competitors = []
        self.p_holders = {}
        self.holder = None
        self.ready = False
        self.tournament = Tournament()

    def add_player(self, Player) -> RoomAbstract :
        if self.ready :
            raise RoomIsFull
        if Player in self.competitors:
            raise AlredyJoined(Player.name, self.name)
        Player._id = self.competitor_id
        self.competitor_id += 1
        self.competitors.append(Player)
        if self.competitors_count() == self.size :
            self.ready = True
        return self

    def remove_player(self, Player) -> None:
        self.competitors.remove(Player)
        Player._id = -1
        self.competitor_id -= 1
        if (self.competitors_count() == 0):
            raise RoomIsEmpty;

    def competitors_count(self) -> int:
        return len(self.competitors)
    
    def is_ready(self) -> bool:
        return (self.competitors_count() == self.size)

    def is_empty(self) -> bool:
        return (self.competitors_count() <= 0)

    def get_data(self) :
        return {
            "id": self._id,
            "competitors" : {competitor.name : competitor.get_data() for competitor in self.competitors},
             
        }

class TwoPlayersRoom(Room):
    def __init__(self):
        super().__init__(size=2)

class FourPlayersRoom(Room):
    def __init__(self):
        super().__init__(size=4)