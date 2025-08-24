from pydantic import BaseModel, ConfigDict

from .extras import GetPlan

class BaseCandidatePlan(BaseModel):
    model_config=ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )

class GetCompanyPlans(BaseModel):
    total_plans: int
    company_plans: list[GetPlan]