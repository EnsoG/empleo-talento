from pydantic import BaseModel, ConfigDict, conint, field_validator
from enum import IntEnum
from datetime import datetime

from utilities import validate_empty_string
from .generic_position import GetGenericPosition
from .performance_area import GetArea
from .city import GetCity
from .contract_type import GetContract
from .job_type import GetJobType

class PositionPreferenceStateEnum(IntEnum):
    active = 1
    inactive = 0

class BasePositionPreference(BaseModel):
    model_config=ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )

class GetPositionPreference(BaseModel):
    preference_id: int
    min_wage: int | None
    max_wage: int | None
    years_min_experience: str | None
    active: PositionPreferenceStateEnum
    creation_date: datetime
    update_date: datetime | None
    generic_position: GetGenericPosition | None
    performance_area: GetArea | None
    city: GetCity | None
    contract_type: GetContract | None
    job_type: GetJobType | None

class CreatePositionPreference(BasePositionPreference):
    min_wage: int | None = None
    max_wage: int | None = None
    years_min_experience: str | None = None
    active: PositionPreferenceStateEnum
    position_id: conint(gt=0) | None = None
    area_id: conint(gt=0) | None = None
    city_id: conint(gt=0) | None = None
    type_id: conint(gt=0) | None = None
    job_type_id: conint(gt=0) | None = None

    @field_validator("years_min_experience")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value

class UpdatePositionPreference(BasePositionPreference):
    min_wage: int | None = None
    max_wage: int | None = None
    years_min_experience: str | None = None
    active: PositionPreferenceStateEnum
    position_id: conint(gt=0) | None = None
    area_id: conint(gt=0) | None = None
    city_id: conint(gt=0) | None = None
    type_id: conint(gt=0) | None = None
    job_type_id: conint(gt=0) | None = None

    @field_validator("years_min_experience")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value