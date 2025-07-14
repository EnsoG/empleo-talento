from pydantic import BaseModel, ConfigDict, EmailStr, field_validator
from enum import IntEnum, Enum

from utilities import (
    validate_empty_string,
    validate_phone_format,
    validate_password
)

class UserStateEnum(IntEnum):
    verify = 0
    active = 1
    inactive = 2

class UserPositionEnum(str, Enum):
    founder = "Fundador"
    staff = "Staff"

class BaseCompanyUser(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )

class GetCompanyUser(BaseModel):
    user_id: int
    name: str
    paternal: str
    maternal: str | None = None
    position: str
    phone: str
    email: str
    state: UserStateEnum
    company_id: int

class GetStaff(BaseModel):
    total_staff: int
    staff: list[GetCompanyUser]

class CreateFounder(BaseCompanyUser):
    name: str
    paternal: str
    maternal: str | None = None
    phone: str
    email: EmailStr
    password: str

    @field_validator("name", "paternal", "maternal")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value
    
    @field_validator("phone")
    def phone_validations(cls, value: str) -> str:
        if not validate_phone_format(value):
            raise ValueError("Incorrect or invalid Phone")
        return value

    @field_validator("password")
    def password_validations(cls, value: str) -> str:
        if not validate_password(value):
            raise ValueError("Incorrect or invalid password")
        return value

class CreateUser(BaseCompanyUser):
    name: str
    paternal: str
    maternal: str | None = None
    position: str
    phone: str
    email: EmailStr
    password: str

    @field_validator("name", "paternal", "maternal", "position")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value
    
    @field_validator("phone")
    def phone_validations(cls, value: str) -> str:
        if not validate_phone_format(value):
            raise ValueError("Incorrect or invalid Phone")
        return value

    @field_validator("password")
    def password_validations(cls, value: str) -> str:
        if not validate_password(value):
            raise ValueError("Incorrect or invalid password")
        return value

class UpdateUser(BaseCompanyUser):
    name: str = ""
    paternal: str = ""
    maternal: str | None = None
    position: str = ""
    phone: str = ""
    state: UserStateEnum = 0

    @field_validator("name", "paternal", "maternal", "position")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value
    
    @field_validator("phone")
    def phone_validations(cls, value: str) -> str:
        if not validate_phone_format(value):
            raise ValueError("Incorrect or invalid Phone")
        return value