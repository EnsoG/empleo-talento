from enum import Enum
from datetime import date
from pydantic import BaseModel, ConfigDict, conint, field_validator

from .publication_category import GetPublicationCategory
from utilities import validate_empty_string

class PublicationStateEnum(str, Enum):
    active = "Activa"
    inactive = "Inactiva"

class BasePublication(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )

class GetPublication(BaseModel):
    publication_id: int
    title: str
    description: str
    creation_date: date
    image: str
    state: PublicationStateEnum
    publication_category: GetPublicationCategory

class GetPublications(BaseModel):
    total_publications: int
    publications: list[GetPublication]

class CreatePublication(BasePublication):
    title: str
    description: str
    state: PublicationStateEnum
    category_id: conint(gt=0)

    @field_validator("title", "description")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value

class UpdatePublication(BasePublication):
    title: str = ""
    description: str = ""
    state: PublicationStateEnum = ""
    category_id: conint(gt=0)

    @field_validator("title", "description")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value