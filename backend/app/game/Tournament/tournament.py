from abc import ABC, abstractmethod
from .matchHolder import MatchHolder
# class AbstractTournament(ABC):
#     def 

class Tournament():
    def __init__(self, _tree=None):
        self.p_holders = {}
        self.tree = _tree
        self.room = None

    def get_player(self, player_name):
        return self.p_holders[player_name]
    
    def get_player_match(self, player_name) -> MatchHolder:
        print("test  ",self.p_holders[player_name].back, flush=True)
        return self.p_holders[player_name].back

    def upgrade_player(self, player_name):
        self.p_holders[player_name].upgrade()

    def get_player_opponent(self, player_name):
        match = self.get_player_match(player_name)
        return match.right if self.get_player(player_name) == match.left else match.left
    # def get_match_name(self, match):
    #     return str(f'{self.room.name}m_{self.match.index}')