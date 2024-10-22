from abc import ABC, abstractmethod 

class RoomAbstract(ABC):
    @abstractmethod
    def add_player(self, Player):
        pass

    @abstractmethod
    def remove_player(self, Player):
        pass

    @abstractmethod
    def players_count(self):
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
        self.size = size
        self.name = ''
        self.players = []
        self.spectators = []
        self.games = []
        self.ready = False

    def add_player(self, Player) -> RoomAbstract :
        if self.ready :
            raise Room.RoomIsFull
        self.players.append(Player)
        if self.players_count() == self.size :
            self.ready = True
        return self

    def remove_player(self, Player) -> None:
        self.players.remove(Player)
        if (self.players_count() == 0):
            raise RoomIsEmpty;

    def players_count(self) -> int:
        return len(self.players)
    
    def is_ready(self) -> bool:
        return (self.players_count() == self.size)

    def is_empty(self) -> bool:
        return (self.players_count() <= 0)
    
    class RoomIsFull(Exception):
        def __init__(self, message="Room Is Full"):
            super().__init__(message)

   class RoomIsEmpty(Exception):
        def __init__(self,message="Room Is Empty" ):
            super().__init__(message) 

class TwoPlayersRoom(Room):
    def __init__(self):
        super().__init__(size=2)

class FourPlayersRoom(Room):
    def __init__(self):
        super().__init__(size=4)