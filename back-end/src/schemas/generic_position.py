from pydantic import BaseModel, ConfigDict, field_validator, conint

from .role_position import GetRolePosition
from utilities import validate_empty_string

class BaseGenericPosition(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )

class GetGenericPosition(BaseModel):
    position_id: int
    name: str
    role_position: GetRolePosition

class GetGenericPositions(BaseModel):
    total_positions: int
    generic_positions: list[GetGenericPosition]

class CreateGenericPosition(BaseGenericPosition):
    name: str
    role_id: conint(gt=0)

    @field_validator("name")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value

class UpdateGenericPosition(BaseGenericPosition):
    name: str = ""
    role_id: conint(gt=0)

    @field_validator("name")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value