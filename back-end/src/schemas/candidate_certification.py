from pydantic import BaseModel, ConfigDict, ValidationInfo, conint, field_validator
from datetime import date

from .certification_type import GetCertificationType
from utilities import (
    validate_earlier_date,
    validate_empty_string
)

class BaseCertification(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )

class GetCertification(BaseModel):
    certification_id: int
    name: str
    institution: str | None
    obtained_date: date | None
    expiration_date: date | None
    description: str | None
    certification_type: GetCertificationType

class CreateCertification(BaseCertification):
    name: str
    institution: str | None = None
    expiration_date: date | None = None
    obtained_date: date | None = None
    description: str | None = None
    certification_type_id: conint(gt=0)

    @field_validator("name", "institution", "description")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value

    @field_validator("obtained_date")
    def start_date_validations(cls, value: date, info: ValidationInfo) -> date:
        if not validate_earlier_date(value, info.data["expiration_date"]):
            raise ValueError("Start date must be less than the end date")
        return value

class UpdateCertification(BaseCertification):
    name: str = ""
    institution: str | None = None
    expiration_date: date | None = None
    obtained_date: date | None = None
    description: str | None = None
    certification_type_id: conint(gt=0) = 1

    @field_validator("name", "institution", "description")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value

    @field_validator("obtained_date")
    def start_date_validations(cls, value: date, info: ValidationInfo) -> date:
        if not validate_earlier_date(value, info.data["expiration_date"]):
            raise ValueError("Start date must be less than the end date")
        return value