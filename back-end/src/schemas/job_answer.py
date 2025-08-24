from pydantic import BaseModel, ConfigDict, conint, field_validator

from .job_question import GetQuestion
from utilities import validate_empty_string

class BaseJobAnswer(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )

class GetAnswer(BaseModel):
    answer_id: int
    answer: str
    job_question: GetQuestion

class CreateAnswer(BaseJobAnswer):
    answer: str
    question_id: conint(gt=0)

    @field_validator("answer")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value