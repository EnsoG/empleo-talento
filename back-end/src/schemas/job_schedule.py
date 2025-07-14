from pydantic import BaseModel, ConfigDict, field_validator
from utilities import validate_empty_string

class BaseSchedule(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )

class GetSchedule(BaseModel):
    schedule_id: int
    name: str

class GetSchedules(BaseModel):
    total_schedules: int
    job_schedules: list[GetSchedule]

class CreateSchedule(BaseSchedule):
    name: str

    @field_validator("name")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value

class UpdateSchedule(BaseSchedule):
    name: str

    @field_validator("name")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value