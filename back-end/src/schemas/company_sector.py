from pydantic import BaseModel, ConfigDict, field_validator
from utilities import validate_empty_string

class BaseSector(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )

class GetSector(BaseModel):
    sector_id: int
    name: str

class GetSectors(BaseModel):
    total_sectors: int
    company_sectors: list[GetSector]

class CreateSector(BaseSector):
    name: str

    @field_validator("name")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value

class UpdateSector(BaseSector):
    name: str = ""

    @field_validator("name")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value