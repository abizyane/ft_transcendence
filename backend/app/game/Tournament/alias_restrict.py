class AliasException(Exception):
    def __init__(self, message=None):
        super().__init__(message)
    pass

class NoAlias(AliasException):
    def __init__(self, message="you have to set an alias to proceed"):
        super().__init__(message)
    pass

class AliasAlreadyUsed(AliasException):
    def __init__(self, message="alias already used ! Please pick another alias"):
        super().__init__(message)
    pass