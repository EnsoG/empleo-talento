from pydantic import BaseModel, ConfigDict, conint

class GetSoftware(BaseModel):
    software_id: int
    name: str

class GetKnowledgeLevel(BaseModel):
    level_id: int
    name: str

class BaseSoftware(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )

class GetCandidateSoftware(BaseModel):
    candidate_software_id: int
    software: GetSoftware
    knownledge_level: GetKnowledgeLevel

class CreateSoftware(BaseSoftware):
    software_id: conint(gt=0)
    level_id: conint(gt=0)

class UpdateSoftware(BaseSoftware):
    level_id: conint(gt=0)