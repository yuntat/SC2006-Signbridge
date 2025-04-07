# from pydantic import BaseModel

# class User(BaseModel):
#     userId: str
#     username: str
#     email: str

from pydantic import BaseModel
from enum import Enum

class UserType(str, Enum):
    admin = "admin"
    normal = "normal"

class User(BaseModel):
    username: str
    password: str
    user_type: UserType


