from abc import ABC, abstractmethod
from .matchHolder import Holder, MatchHolder, PlayerHolder
from .competitor import Competitor

class Tournament():
    def __init__(self):
        self.p_holder = {}
        self.tree = None

    def set_pholders(self, competitor):
        self.p_holder[competitor.name] = PlayerHolder(Competitor)
    
    def set_tree(self, root):
        self.tree = root

    def get_competitor_holder(self, competitor_name) -> PlayerHolder:
        return self.p_holder[competitor_name]
    
    def get_match(self, competitor_name) -> Holder:
        return self.p_holder[competitor_name].back

    def upgrade_competitor(self, competitor_name) -> None:
       self.p_holder[competitor_name].upgrade()


class AbstractTournamentManager(ABC):
    def upgrade_winner(self, _winner):
        pass

    

class ImplementTournamentManger(AbstracTournamentManager):
    def __init__(self, tournament):
        self.tournament = tournament