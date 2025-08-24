from pydantic import BaseModel, ConfigDict, field_validator
from utilities import validate_empty_string

class BaseAdmin(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )

class GetAdmin(BaseModel):
    admin_id: int
    name: str
    paternal: str
    maternal: str | None = None
    email: str

class UpdateAdmin(BaseAdmin):
    name: str = ""
    paternal: str = ""
    maternal: str | None = None

    @field_validator("name", "paternal", "maternal")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value