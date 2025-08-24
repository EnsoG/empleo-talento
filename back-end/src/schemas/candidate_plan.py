from pydantic import BaseModel, ConfigDict

from .extras import GetPlan

class BaseCandidatePlan(BaseModel):
    model_config=ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )

class GetCandidatePlans(BaseModel):
    total_plans: int
    candidate_plans: list[GetPlan]