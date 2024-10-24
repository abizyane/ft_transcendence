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
    pass

class PlayerHolder(Holder):
    def __init__(self, competitor):
        # self.competitor = competitor
        self.back:Holder = None
        self.left: Holder = None
        self.right: Holder = None
        self.lvl = 0
        self.index = 0
    pass

class MatchTreeBuilder(AbstractMatchBuilder):
    # def __init__(self, match):
    #     self.room = match

    @staticmethod
    def build_tree(holder:Holder, index:int ,lvl:int, competitor_generator,size):
        holder.lvl = lvl
        holder.index = index
        if isinstance(holder, PlayerHolder) :
            # MatchTreeBuilder.build_leafs(holder, index,lvl + 1, competitor_generator)
            return holder
        holder.left = MatchHolder() if (2 ** lvl < size) else PlayerHolder(next(competitor_generator))
        holder.right = MatchHolder() if (2 ** lvl < size) else PlayerHolder(next(competitor_generator))
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
    
    @staticmethod
    def visualize_tree(holder:Holder, lvl, size) -> None:
        print(f"{holder.lvl * '\t'}{'m' if isinstance(holder, MatchHolder) else 'p'}:{holder.index}")
        if (2 ** lvl) >= size :
            return
        MatchTreeBuilder.visualize_tree(holder.left, lvl + 1,size)
        MatchTreeBuilder.visualize_tree(holder.right, lvl + 1,size)
        pass
        

