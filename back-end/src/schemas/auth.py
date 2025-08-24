from pydantic import BaseModel, ConfigDict, EmailStr

from .extras import UserRoleEnum

class BaseAuth(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )

class Login(BaseAuth):
    email: EmailStr
    password: str
    user_role: UserRoleEnum

class LoginOAuth(BaseAuth):
    email: EmailStr
    name: str
    paternal: str