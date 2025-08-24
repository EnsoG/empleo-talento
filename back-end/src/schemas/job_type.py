from pydantic import BaseModel, ConfigDict, field_validator
from utilities import validate_empty_string

class BaseJobType(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )

class GetJobType(BaseModel):
    job_type_id: int
    name: str

class GetJobTypes(BaseModel):
    total_types: int
    job_types: list[GetJobType]

class CreateJobType(BaseJobType):
    name: str

    @field_validator("name")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value

class UpdateJobType(BaseJobType):
    name: str = ""

    @field_validator("name")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value