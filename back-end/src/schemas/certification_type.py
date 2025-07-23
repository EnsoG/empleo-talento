from pydantic import BaseModel, ConfigDict, field_validator
from utilities import validate_empty_string

class BaseCertificationType(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )

class GetCertificationType(BaseModel):
    certification_type_id: int
    name: str

class GetCertificationTypes(BaseModel):
    total_types: int
    certification_types: list[GetCertificationType]

class CreateCertificationType(BaseCertificationType):
    name: str

    @field_validator("name")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value

class UpdateCertificationType(BaseCertificationType):
    name: str = ""

    @field_validator("name")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value