from pydantic import BaseModel, ConfigDict, conint, conlist
from enum import Enum
from datetime import date

from .job_offer import GetSummaryOffer
from .job_answer import CreateAnswer, GetAnswer
from .candidate import GetSummaryCandidate

class PostulationStateEnum(str, Enum):
    postulate = "Postulado"
    in_progress = "En Proceso"
    not_selected = "No Seleccionado"
    contracted = "Contratado"

class BasePostulation(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )

class GetPostulation(BaseModel):
    postulation_id: int
    postulation_date: date
    state: PostulationStateEnum
    candidate: GetSummaryCandidate
    job_answers: list[GetAnswer] | None = None

class GetCandidatePostulation(BaseModel):
    postulation_id: int
    postulation_date: date
    state: PostulationStateEnum
    offer_id: int
    job_offer: GetSummaryOffer

class GetPostulations(BaseModel):
    total_postulations: int
    postulations: list[GetCandidatePostulation] | list[GetPostulation]

class CreatePostulation(BasePostulation):
    offer_id: conint(gt=0)
    answers: conlist(CreateAnswer, min_length=1) | None = None

class UpdatePostulation(BasePostulation):
    state: PostulationStateEnum