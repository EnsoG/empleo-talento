from pydantic import BaseModel

class GetRegion(BaseModel):
    number_region: int
    name: str