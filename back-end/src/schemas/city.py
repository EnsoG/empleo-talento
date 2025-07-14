from pydantic import BaseModel

from .region import GetRegion

class GetCity(BaseModel):
    city_id: int
    name: str
    region: GetRegion