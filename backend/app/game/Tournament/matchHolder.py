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
        self.lvl = 0
    pass

class PlayerHolder(Holder):
    def __init__(self, competitor):
        self.competitor = competitor
        self.back:Holder = None
        self.lvl = 0
    pass

class MatchTreeBuilder(AbstractMatchBuilder):
    # def __init__(self, match):
    #     self.room = match

    @staticmethod
    def build_tree(self, holder:Holder ,lvl:int, competitor_generator):
        if (2 ** lvl == self.holder.size) :
            holder.build_leafs(lvl, competitor_generator)
            return
        holder.lvl = lvl
        holder.left = MatchHolder()
        holder.right = MatchHolder()
        holder.right.back = holder.left.back = holder
        build_tree(holder.left, lvl + 1, competitor_generator)
        build_tree(holder.right, lvl + 1, competitor_generator)
        return holder

    def build_leaf(self, composite, lvl, competitor_gen) -> None:
        composite.left = next(competitor_gen)
        composite.left.lvl = lvl
        composite.right = next(competitor_gen)
        composite.right.lvl = lvl
        composite.right.back = composite.left.back = composite
        pass

