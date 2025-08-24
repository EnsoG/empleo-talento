from pydantic import BaseModel, ConfigDict, field_validator
from utilities import validate_empty_string

class BaseSoftware(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )

class GetSoftware(BaseModel):
    software_id: int
    name: str

class GetSoftwares(BaseModel):
    total_softwares: int
    softwares: list[GetSoftware]

class CreateSoftware(BaseSoftware):
    name: str

    @field_validator("name")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value

class UpdateSoftware(BaseSoftware):
    name: str = ""

    @field_validator("name")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value