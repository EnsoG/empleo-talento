from pydantic import BaseModel

class GetArea(BaseModel):
    area_id: int
    name: str