from pydantic import BaseModel, ConfigDict, field_validator
from utilities import validate_empty_string

class BaseRolePosition(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )

class GetRolePosition(BaseRolePosition):
    role_id: int
    name: str

class GetRolePositions(BaseModel):
    total_roles: int
    role_positions: list[GetRolePosition]

class CreateRolePosition(BaseRolePosition):
    name: str

    @field_validator("name")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value

class UpdateRolePosition(BaseRolePosition):
    name: str = ""

    @field_validator("name")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value