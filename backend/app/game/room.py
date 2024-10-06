import ABC, abstractmethod from abc

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
    pass

class RoomIsFull(Exception):
    def __init__(self):
        self.super(message="Room Is Full")

class RoomIsEmpty(Exception):
    def __init__(self):
        self.super(message="Room Is Empty")

class Room(RoomAbstract):
    def __init__(self, size):
        self.size = size
        self.players = []
        self.spectators = []
        self.games = []
        self.ready = False

    def add_player(self, Player):
        if self.ready :
            raise RoomIsFull;
        self.players.append(Player);
        if self.players_count() == self.size:
            self.ready = True

    def remover_player(self, Player):
        self.players.remove(Player)
        if (self.players_count() == 0):
            raise RoomIsEmpty;

    def players_count(self):
        return len(self.players)

    


class TwoPlayersRoom(Room):
    def __init__(self, size=2):
        self.super(size=size)

class FourPlayersRoom(Room):
    def __init__(self, size=4):
        self.super(size=size)




