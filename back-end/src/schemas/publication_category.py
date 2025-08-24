from pydantic import BaseModel, ConfigDict, field_validator
from utilities import validate_empty_string

class BasePublicationCategory(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )

class GetPublicationCategory(BaseModel):
    category_id: int
    name: str

class GetPublicationCategories(BaseModel):
    total_categories: int
    publication_categories: list[GetPublicationCategory]

class CreatePublicationCategory(BasePublicationCategory):
    name: str

    @field_validator("name")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value

class UpdatePublicationCategory(BasePublicationCategory):
    name: str = ""

    @field_validator("name")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value