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
        self.competitor = competitor
        self.back:Holder = None
        self.lvl = 0
        self.index = 0
    pass

class MatchTreeBuilder(AbstractMatchBuilder):
    # def __init__(self, match):
    #     self.room = match

    @staticmethod
    def build_tree(holder:Holder, index:int ,lvl:int, competitor_generator):
        if (2 ** lvl == holder.size) :
            MatchTreeBuilder.build_leafs(holder, lvl, competitor_generator)
            return holder
        holder.lvl = lvl
        holder.index = index
        holder.left = MatchHolder()
        holder.right = MatchHolder()
        holder.right.back = holder.left.back = holder
        MatchTreeBuilder.build_tree(holder.left, index + 1, lvl + 1, competitor_generator)
        MatchTreeBuilder.build_tree(holder.right, index + 2, lvl + 1, competitor_generator)
        return holder

    @staticmethod
    def build_leafs(composite, lvl, competitor_gen) -> None:
        try:
            composite.left = next(competitor_gen)
            composite.left.lvl = lvl + 1
            composite.right = next(competitor_gen)
            composite.right.lvl = lvl + 1
            composite.right.back = composite.left.back = composite
        except Exception as e:
            print(e)
        pass

    @staticmethod
    def visualize_tree(holder:Holder, lvl, size) -> None:
        print("%s h:%s" % ((holder.lvl * '\t'), holder.index))
        if (2 ** lvl) >= size :
            return
        MatchTreeBuilder.visualize_tree(holder.left, lvl + 1, size)
        MatchTreeBuilder.visualize_tree(holder.right, lvl + 1, size)
        pass
        

