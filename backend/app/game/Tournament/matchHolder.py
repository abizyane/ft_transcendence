from abc import ABC, abstractmethod

class AbstractMatchBuilder(ABC):
    @abstractmethod
    def build_tree(self):
        pass
    pass

class Holder(ABC):
    pass

class MatchHolder(Holder):
    def __init__(self):
        self.left: Holder = None
        self.right: Holder = None
        self.back:Holder = None
        self.size = 2
        self.index = 0
        self.lvl = 0
        self.state = 'NONE'
        self.game = None
        
    def is_ready(self):
        return isinstance(self.left, PlayerHolder) and isinstance(self.right, PlayerHolder)
    
    def get_players(self):
        if not self.is_ready() :
            raise ValueError("Cant Get Room Players")
        return {
            self.left.get_name() : self.left.paddle,
            self.right.get_name() : self.right.paddle
        }

    def get_opponent(self, p_holder):
        return self.left if p_holder == self.right else self.right
    pass

class PlayerHolder(Holder):
    def __init__(self, competitor):
        self.competitor = competitor
        self.back:Holder = None
        self.left: Holder = None
        self.right: Holder = None
        self.paddle = None
        self.lvl = 0
        self.index = 0
    
    def upgrade(self):
        match = self.back
        tmp = match.back
        if tmp:
            if tmp.left == match:
                tmp.left = self
            else:
                tmp.right = self
            self.lvl = match.lvl
            self.back = tmp
        else:
            raise ValueError("You Cant Upgrade AnyMore")

    def get_paddle_data(self):
        return self.paddle.data() #paddle is Player class for Now
    
    def get_name(self):
        return self.competitor.name
    
    def paddle_command(self, _cmd):
        if _cmd == "keyW_up":
            self.paddle.isW = True
        elif _cmd == "keyW_down":
            self.paddle.isW = False
        elif _cmd == "keyS_up":
            self.paddle.isS = True
        elif _cmd == "keyS_down":
            self.paddle.isS = False
    def is_won(self):
        return self.paddle.win_state == 'WIN'
    pass

class MatchTreeBuilder(AbstractMatchBuilder):
    # def __init__(self, match):
    #     self.room = match
    @staticmethod
    def build_tree(holder:Holder, index:int ,lvl:int, competitor_generator,size):
        holder.lvl = lvl
        holder.index = index
        if isinstance(holder, PlayerHolder) :
            return holder
        holder.left = MatchHolder() if (2 ** lvl < size) else next(competitor_generator)
        holder.right = MatchHolder() if (2 ** lvl < size) else next(competitor_generator)
        holder.right.back = holder.left.back = holder
        index *= 2
        MatchTreeBuilder.build_tree(holder.left, index + 1    , lvl + 1, competitor_generator, size)
        MatchTreeBuilder.build_tree(holder.right, index + 2, lvl + 1, competitor_generator, size)
        return holder

    @staticmethod
    def build_leafs(composite, index,lvl, competitor_gen) -> None:
        composite.left = next(competitor_gen)
        composite.left.lvl = lvl
        composite.left.index = index + 1
        composite.right = next(competitor_gen)
        composite.right.lvl = lvl
        composite.right.index = index + 2
        composite.right.back = composite.left.back = composite
        pass
    
    def get_leafs(composite, lvl):
        lst = []
        if isinstance(composite, PlayerHolder):
            return [composite]
        lst.append(MatchTreeBuilder.get_leafs(composite.left, lvl))
        lst.append(MatchTreeBuilder.get_leafs(composite.right, lvl))
        return lst
    
    @staticmethod
    def visualize_tree(holder:Holder, lvl, size) -> None:
        print("%s%s:%s" % (holder.lvl, ('m' if isinstance(holder, MatchHolder) else 'p'), holder.index))
        if (2 ** lvl) >= size :
            return
        MatchTreeBuilder.visualize_tree(holder.left, lvl + 1,size)
        MatchTreeBuilder.visualize_tree(holder.right, lvl + 1,size)
        pass
        
class AbstractTournamentManager(ABC):
    def update_tree(self):
        pass
    
    def upgrade_winner(self):
        pass
    
    def set_tournament_winner(self):
        pass
    
    def is_match_ready(self):
        pass
    
    def set_winner_lvl(self):
        pass
    
# class TournamentManager(AbstractTournamentManager):
#     def __init__(self, match_root):
#         self.match_holder = match_root
    
#     def get_winner(self, competitors):
#         winners = []
#         for competitor in competitors:
#             if competitor.won:
#                 winners.append(competitor)
#         return winners

#     def update_tree(self, competitors):
#         winners = self.get_winners(competitors)
#         for winner in winners:
#             winner.upgrade()
#             winner.won = False
#             winner.lvl -= 1
        