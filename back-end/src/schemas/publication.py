from pydantic import BaseModel, ConfigDict, conint, field_validator
from enum import Enum

from utilities import validate_empty_string

class PublicationStateEnum(str, Enum):
    active = "Activa"
    inactive = "Inactive"

class BasePublication(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )

class CreatePublication(BasePublication):
    title: str
    description: str
    image: str
    state: PublicationStateEnum
    category_id: conint(gt=0)

    @field_validator("title", "description", "image", "state")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value

class UpdatePublication(BasePublication):
    title: str = ""
    description: str = ""
    image: str = ""
    state: PublicationStateEnum = ""

    @field_validator("title", "description", "image")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value