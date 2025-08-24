from pydantic import BaseModel, ConfigDict, ValidationInfo, conint, condate, conlist, field_validator, model_validator
from datetime import date, timedelta
from enum import Enum, IntEnum

from .job_question import CreateQuestion
from .performance_area import GetArea
from .city import GetCity
from .job_type import GetJobType
from .job_question import GetQuestion
from .company import GetSummaryCompany
from .contract_type import GetContract
from .job_schedule import GetSchedule
from .shift import GetShift
from .job_day import GetJobDay
from utilities import (
    validate_empty_string,
    validate_earlier_date
)

class OfferStateEnum(str, Enum):
    pending = "Pendiente Aprobacion"
    active = "Activa"
    finished = "Finalizada"

class OfferFeaturedEnum(IntEnum):
    not_featured = 0
    featured = 1

class BaseJobOffer(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True, 
        extra="forbid"
    )

class GetOffer(BaseModel):
    offer_id: int
    code: int
    title: str
    position: str | None = None
    description: str | None = None
    requirements: str | None = None
    years_experience: str | None = None
    salary: int | None = None
    location: str | None = None
    closing_date: date | None = None
    publication_date: date
    state: OfferStateEnum
    featured: int
    performance_area: GetArea | None = None
    city: GetCity | None = None
    company: GetSummaryCompany | None = None
    contract_type: GetContract | None = None
    job_type: GetJobType | None = None
    job_schedule: GetSchedule | None = None
    shift: GetShift | None = None
    job_day: GetJobDay | None = None
    job_questions: list[GetQuestion]

class GetSummaryOffer(BaseModel):
    offer_id: int
    title: str
    code: int
    position: str | None = None
    description: str | None = None
    publication_date: date
    closing_date: date | None = None
    state: OfferStateEnum
    featured: OfferFeaturedEnum
    city: GetCity | None = None
    contract_type: GetContract | None = None
    company: GetSummaryCompany | None = None

class GetOffers(BaseModel):
    total_offers: int
    offers: list[GetSummaryOffer]

class CreateOffer(BaseJobOffer):
    title: str
    position: str | None = None
    generic_position_id: int | None = None
    description: str | None = None
    requirements: str | None = None
    years_experience: str | None = None
    salary: conint(gt=0) | None = None
    location: str | None = None
    closing_date: date | None = None
    publication_date: condate(ge=date.today()) = date.today()
    questions: conlist(CreateQuestion, min_length=1) | None = None
    area_id: conint(gt=0) | None = None
    city_id: conint(gt=0) | None = None
    type_id: conint(gt=0) | None = None
    schedule_id: conint(gt=0) | None = None
    job_type_id: conint(gt=0) | None = None
    shift_id: conint(gt=0) | None = None
    day_id: conint(gt=0) | None = None

    @model_validator(mode="after")
    def validate_create_offer(self) -> "CreateOffer":
        # Check Generic Position Id And Position
        if self.generic_position_id and not self.position:
            raise ValueError("Position field must be on the request if generic position is included")
        return self

    @field_validator("title", "position", "description", "requirements", "years_experience", "location")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value

    @field_validator("publication_date")
    def publication_date_validations(cls, value: date, info: ValidationInfo) -> date:
        if not validate_earlier_date(value, info.data["closing_date"]):
            raise ValueError("Publication date must be less than the closing date")
        return value

class UpdateOffer(BaseJobOffer):
    title: str = ""
    description: str | None = None
    requirements: str | None = None
    years_experience: str | None = None
    salary: conint(gt=0) | None = None
    location: str | None = None
    closing_date: date | None = None
    state: OfferStateEnum = ""
    area_id: conint(gt=0) | None = None
    city_id: conint(gt=0) | None = None
    company_id: conint(gt=0) | None = None
    type_id: conint(gt=0) | None = None
    schedule_id: conint(gt=0) | None = None
    job_type_id: conint(gt=0) | None = None
    shift_id: conint(gt=0) | None = None
    day_id: conint(gt=0) | None = None

    @field_validator("title", "description", "requirements", "years_experience", "location")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value