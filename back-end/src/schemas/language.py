from pydantic import BaseModel, ConfigDict, field_validator
from utilities import validate_empty_string

class BaseLanguage(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )

class GetLanguage(BaseLanguage):
    language_id: int
    name: str

class GetLanguages(BaseModel):
    total_languages: int
    languages: list[GetLanguage]

class CreateLanguage(BaseLanguage):
    name: str

    @field_validator("name")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value

class UpdateLanguage(BaseLanguage):
    name: str = ""

    @field_validator("name")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value