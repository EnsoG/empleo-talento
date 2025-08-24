from pydantic import BaseModel, ConfigDict, field_validator
from utilities import validate_empty_string

class BaseJobDay(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )

class GetJobDay(BaseModel):
    day_id: int
    name: str

class GetJobDays(BaseModel):
    total_days: int
    job_days: list[GetJobDay]

class CreateJobDay(BaseJobDay):
    name: str

    @field_validator("name")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value

class UpdateJobDay(BaseJobDay):
    name: str = ""

    @field_validator("name")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value