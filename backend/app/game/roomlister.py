from abc import ABC, abstractmethod 
from room import Room
from functools import singledispatchmethod

class RoomLister():
    def __init__(self, *args):
        self.validated_attr = []
        for arg in args:
            self.append(arg)
    
    @singledispatchmethod
    def append(self, item):
        raise TypeError(f"Unsupported type for append: {type(item)}")
    
    @append.register(Room)
    def _(self, room):
        if not isinstance(room, Room):
            raise ValueError("This is Not a room instance")
        attr_name = (type(room).__name__).lower()
        if not hasattr(self, attr_name):
            self.validated_attr.append(attr_name)
            setattr(self, attr_name, [])
        _list = getattr(self, attr_name)
        _list.append(room)
    
    @append.register(list)
    def _(self, rooms):
        for room in rooms:
            self.append(room)

    def remove(self, obj) -> Room:
        attr_name = (type(obj).__name__).lower()
        if not hasattr(self, attr_name) :
            raise ValueError("Cant remove this object")
        _list = getattr(self, attr_name)
        return _list.pop(_list.index(obj))

    def __str__(self):
        result = ""
        for attr in dir(self):
            if attr in self.validated_attr:
                result += f'{attr}: {str(getattr(self, attr))}\n'
        result = result[:-1]
        return result