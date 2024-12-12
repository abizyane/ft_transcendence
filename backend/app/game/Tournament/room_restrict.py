class RoomRestriction(Exception):
        def __init__(self, message=None):
            super().__init__(message)
        pass

class RoomIsFull(RoomRestriction):
        def __init__(self, message="Room Is Full"):
            super().__init__(message)

class RoomIsEmpty(RoomRestriction):
    def __init__(self,message="Room Is Empty" ):
        super().__init__(message)
    
class MustHaveName(RoomRestriction):
    def __init__(self, message="Name Your Room"):
        super().__init__(message)
    
class RoomNameAlreadyExist(RoomRestriction):
    def __init__(self, name:str):
        super().__init__(message=f'the room name: {name} already exist please change the room name')

class RoomNotExist(RoomRestriction):
    def __init__(self, name):
        super().__init__(message=f'room with name: {name} do not exist')

class RoomRequestNameRequired(RoomRestriction):
    def __init__(self, message="Joining a room required a name"):
        super().__init__(message)

class AlredyJoined(RoomRestriction):
    def __init__(self, competitor_name, room_name):
        super().__init__(message=f'competitor {competitor_name} already joined room:{room_name}')