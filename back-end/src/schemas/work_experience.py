from pydantic import BaseModel, ConfigDict, ValidationInfo, field_validator
from datetime import date

from utilities import (
    validate_empty_string,
    validate_earlier_date
)

class BaseWorkExperience(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )

class GetExperience(BaseModel):
    experience_id: int
    position: str
    description: str | None = None
    company: str | None = None
    start_date: date
    end_date: date | None = None

class CreateExperience(BaseWorkExperience):
    position: str
    description: str | None = None
    company: str | None = None
    end_date: date | None = None
    start_date: date

    @field_validator("position", "description", "company")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value

    @field_validator("start_date")
    def start_date_validations(cls, value: date, info: ValidationInfo) -> date:
        if not validate_earlier_date(value, info.data["end_date"]):
            raise ValueError("Start date must be less than the end date")
        return value

class UpdateExperience(BaseWorkExperience):
    position: str = ""
    description: str | None = None
    company: str | None = None
    end_date: date | None = None
    start_date: date = date.today()

    @field_validator("position", "description", "company")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value

    @field_validator("start_date")
    def start_date_validations(cls, value: date, info: ValidationInfo) -> date:
        if not validate_earlier_date(value, info.data["end_date"]):
            raise ValueError("Start date must be less than the end date")
        return value
