from pydantic import BaseModel, ConfigDict, EmailStr, field_validator

from utilities import (
    validate_empty_string,
    validate_run_format,
    validate_phone_format
)
from .company_user import CreateFounder, UserStateEnum
from .company_sector import GetSector

class BaseCompany(BaseModel):
    model_config=ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )

class GetCompany(BaseModel):
    company_id: int
    rut: str
    legal_name: str
    trade_name: str
    web: str | None = None
    email: str
    description: str | None = None
    phone: str
    logo: str | None = None
    company_sector: GetSector | None = None

class GetSummaryCompany(BaseModel):
    company_id: int
    trade_name: str
    web: str | None = None
    email: str
    description: str | None = None
    phone: str
    logo: str | None = None
    company_sector: GetSector | None = None

class GetCompanyWithState(GetCompany):
    state: int

class GetCompanies(BaseModel):
    total_companies: int
    companies: list[GetCompanyWithState]

class CreateCompany(BaseCompany):
    rut: str
    legal_name: str
    trade_name: str
    email: EmailStr
    phone: str
    sector_id: int
    company_user: CreateFounder

    @field_validator("legal_name", "trade_name")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value

    @field_validator("rut")
    def run_validations(cls, value: str) -> str:
        if not validate_run_format(value):
            raise ValueError("Incorrect or invalid RUT")
        return value

    @field_validator("phone")
    def phone_validations(cls, value: str) -> str:
        if not validate_phone_format(value):
            raise ValueError("Incorrect or invalid Phone")
        return value

class UpdateCompany(BaseCompany):
    trade_name: str = ""
    web: str | None = None
    description: str | None = None
    email: str = ""
    phone: str = ""
    sector_id: int | None = None

    @field_validator("trade_name", "web", "description")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value

    @field_validator("phone")
    def phone_validations(cls, value: str) -> str:
        if not validate_phone_format(value):
            raise ValueError("Incorrect or invalid Phone")
        return value

class UpdateCompanyState(BaseCompany):
    state: UserStateEnum