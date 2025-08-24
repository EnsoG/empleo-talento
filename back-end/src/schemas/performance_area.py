from pydantic import BaseModel, ConfigDict, field_validator
from utilities import validate_empty_string

class BaseArea(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )

class GetArea(BaseModel):
    area_id: int
    name: str

class GetAreas(BaseModel):
    total_areas: int
    performance_areas: list[GetArea]

class CreateArea(BaseArea):
    name: str

    @field_validator("name")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value

class UpdateArea(BaseArea):
    name: str = ""

    @field_validator("name")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value