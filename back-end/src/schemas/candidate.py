from pydantic import BaseModel, ConfigDict, EmailStr, field_validator, conint
from enum import Enum
from datetime import date

from .extras import NationalityEnum
from utilities import (
    validate_run_format,
    validate_empty_string,
    validate_phone_format,
    validate_password,
    validate_legal_age
)

class GenderEnum(str, Enum):
    male = "Masculino"
    female = "Femenino"
    dontSpecify = "No Especificar"
    
class GetDriverLicense(BaseModel):
    license_id: int
    license: str

class BaseCandidate(BaseModel):
    model_config=ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )

class GetSummaryCandidate(BaseModel):
    candidate_id: int
    run: str | None = None
    name: str
    paternal: str
    maternal: str | None = None
    phone: str | None = None
    email: str

class GetCandidate(GetSummaryCandidate):
    candidate_id: int
    run: str | None = None
    birth_date: date | None = None
    gender: str | None = None
    featured_study: str | None = None
    nationality: str | None = None
    photo: str | None = None
    resume: str | None = None
    driver_license: GetDriverLicense | None = None

class CreateCandidate(BaseCandidate):
    name: str
    paternal: str
    maternal: str | None = None
    run: str
    email: EmailStr
    password: str

    @field_validator("name", "paternal", "maternal")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value

    @field_validator("run")
    def run_validations(cls, value: str | None) -> str:
        if value and not validate_run_format(value):
            raise ValueError("Incorrect or invalid RUN")
        return value

    @field_validator("password")
    def password_validations(cls, value: str) -> str:
        if not validate_password(value):
            raise ValueError("Incorrect or invalid password")
        return value

class UpdateCandidate(BaseCandidate):
    run: str | None = None
    name: str = ""
    paternal: str = ""
    maternal: str | None = None
    birth_date: date | None = None
    gender: GenderEnum | None = None
    nationality: NationalityEnum | None = None
    featured_study: str | None = None
    phone: str | None = None
    license_id: conint(gt=0) | None = None

    @field_validator("name", "paternal", "maternal")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value
    
    @field_validator("run")
    def run_validations(cls, value: str | None) -> str:
        if value and not validate_run_format(value):
            raise ValueError("Incorrect or invalid RUN")
        return value
    
    @field_validator("birth_date")
    def birth_date_validations(cls, value: date) -> date:
        if not validate_legal_age(value):
            raise ValueError("Date of birth corresponds to a minor")
        return value

    @field_validator("phone")
    def phone_validations(cls, value: str) -> str:
        if not validate_phone_format(value):
            raise ValueError("Incorrect or invalid Phone")
        return value