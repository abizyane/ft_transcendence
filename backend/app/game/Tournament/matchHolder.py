from abc import ABC, abstractmethod

class AbstractMatchBuilder(ABC):
    @abstractmethod
    def build_tree(self):
        pass
    pass

class Holder(ABC):
    pass

class MatchHolder(Holder):
    pass

class PlayerHolder(Holder):
    def __init__(self, lvl):
        self.lvl = lvl
    pass

class MatchTreeBuilder(AbstractMatchBuilder):
    def __init__(self, match):
        self.room = match

    def build_tree(self, holder:Holder ,lvl:int, player_generator):
        if (2 ** lvl == self.holder.size) :
            holder.build_leafs(lvl, player_generator)
            return
        self.lvl = lvl
        self.holder.left = MatchHolder()
        self.holder.right = MatchHolder()
        build_tree(holder.left, lvl + 1, player_generator)
        build_tree(holder.right, lvl + 1, player_generator)
        return holder

    def build_leaf(self, composite, lvl) -> None:
        composite.left = PlayerHolder(lvl)
        composite.rigt = PlayerHolder(lvl)
        pass