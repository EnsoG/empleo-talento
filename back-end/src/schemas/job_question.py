from pydantic import BaseModel, ConfigDict, field_validator
from enum import IntEnum

from utilities import validate_empty_string

class QuestionTypeEnum(IntEnum):
    yerOrNo = 0
    numeric = 1

class BaseJobQuestion(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )

class GetQuestion(BaseModel):
    question_id: int
    question: str
    question_type: QuestionTypeEnum

class CreateQuestion(BaseJobQuestion):
    question: str
    question_type: QuestionTypeEnum

    @field_validator("question")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value