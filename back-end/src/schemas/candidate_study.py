from pydantic import BaseModel, ConfigDict, ValidationInfo, field_validator
from datetime import date

from utilities import (
    validate_empty_string,
    validate_earlier_date
)

class BaseCompanyStudy(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )

class GetStudy(BaseModel):
    study_id: int
    title: str
    institution: str
    start_date: date
    end_date: date | None = None

class CreateStudy(BaseCompanyStudy):
    title: str
    institution: str
    end_date: date | None = None
    start_date: date

    @field_validator("title", "institution")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value

    @field_validator("start_date")
    def start_date_validations(cls, value: date, info: ValidationInfo) -> date:
        if not validate_earlier_date(value, info.data["end_date"]):
            raise ValueError("Start date must be less than the end date")
        return value

class CreateFeaturedStudy(BaseCompanyStudy):
    title: str
    institution: str
    end_date: date | None = None
    start_date: date

    @field_validator("title", "institution")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value

    @field_validator("start_date")
    def start_date_validations(cls, value: date, info: ValidationInfo) -> date:
        if not validate_earlier_date(value, info.data["end_date"]):
            raise ValueError("Start date must be less than the end date")
        return value

class UpdateStudy(BaseCompanyStudy):
    title: str = ""
    institution: str = ""
    end_date: date | None = None
    start_date: date  = date.today()

    @field_validator("title", "institution")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value

    @field_validator("start_date")
    def start_date_validations(cls, value: date, info: ValidationInfo) -> date:
        if not validate_earlier_date(value, info.data["end_date"]):
            raise ValueError("Start date must be less than the end date")
        return value