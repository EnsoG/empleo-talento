from pydantic import BaseModel, ConfigDict, field_validator
from utilities import validate_empty_string

class BaseShift(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )

class GetShift(BaseModel):
    shift_id: int
    name: str

class GetShifts(BaseModel):
    total_shifts: int
    shifts: list[GetShift]

class CreateShift(BaseShift):
    name: str

    @field_validator("name")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value

class UpdateShift(BaseShift):
    name: str = ""

    @field_validator("name")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value