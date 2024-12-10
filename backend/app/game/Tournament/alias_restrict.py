class AliasException(Exception):
    def __init__(self, message=None):
        super().__init__(message=message)
    pass

class NoAlias(AliasException):
    def __init__(self, message=None):
        super().__init__(message="you have to set an alias to proceed")
    pass

class AliasAlreadyUsed(AliasException):
    def __init__(self, message=None):
        super().__init__(message="alias already used ! Please pick another alias")
    pass