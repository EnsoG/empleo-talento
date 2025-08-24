from pydantic import BaseModel, ConfigDict, conint

from .language import GetLanguage

class GetLanguageLevel(BaseModel):
    level_id: int
    name: str

class BaseLanguage(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )

class GetCandidateLanguage(BaseModel):
    candidate_language_id: int
    language: GetLanguage
    language_level: GetLanguageLevel

class CreateLanguage(BaseLanguage):
    language_id: conint(gt=0)
    level_id: conint(gt=0)

class UpdateLanguage(BaseLanguage):
    level_id: conint(gt=0)