from abc import ABC, abstractmethod

from urllib.parse import urljoin
from django.conf import settings
from ..models import TournamentPic 
from .tournament import Tournament
from .room_restrict import RoomIsFull, AlredyJoined, RoomIsEmpty
from channels.db import database_sync_to_async

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
def build_absolute_image_uri(scope, relative_path):
    host = dict(scope['headers']).get(b'host', b'localhost').decode('utf-8')
    scheme = scope.get('scheme', 'http')
    base_url = f"{scheme}://{host}"
    if relative_path is None:
        return urljoin(base_url, settings.MEDIA_URL + "Profil.jpg")
    return urljoin(base_url, settings.MEDIA_URL + relative_path)

class Room(RoomAbstract):
    def __init__(self, size):
        self.competitor_id = 0
        self.size = size
        self.name = ''
        self.competitors = []
        self.winners = []
        self.p_holders = {}
        self.holder = None
        self.ready = False
        self.started = False
        self.imageModel = None
        self.imageUrl = None
        self.tournament = Tournament()
    @database_sync_to_async
    def set_image(self, image_id, scope=None):
        try:
            picture = TournamentPic.objects.get(id=image_id)
            self.imageModel = picture
            if self.imageModel:
                self.imageUrl = build_absolute_image_uri(scope, picture.picture)
                print("Image setted to ",self.imageUrl, flush=True)
        except Exception as e:
            print(e, flush=True)
            print("Image not found", flush=True)

    def get_image(self):
        return self.imageUrl

    def add_player(self, Player) -> RoomAbstract :
        if self.ready or self.started:
            raise RoomIsFull
        if Player.joined:
            raise AlredyJoined(Player.name, Player.room.name)
        Player._id = self.competitor_id
        self.competitor_id += 1
        self.competitors.append(Player)
        if self.competitors_count() == self.size :
            self.ready = True
        return self

    def remove_player(self, Player) -> None:
        self.competitors.remove(Player)
        self.ready = False
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
        return dict({
            "name" : self.name,
            "size": self.competitors_count(),
            "started" : self.started,
            "img" : self.imageUrl,
            "competitors" : [competitor.get_info() for competitor in self.competitors]
        })
    def get_winners_info(self):
        res = []
        for winner in self.winners:
            res.append(winner.get_info())
        return res

class TwoPlayersRoom(Room):
    def __init__(self):
        super().__init__(size=2)

class FourPlayersRoom(Room):
    def __init__(self):
        super().__init__(size=4)