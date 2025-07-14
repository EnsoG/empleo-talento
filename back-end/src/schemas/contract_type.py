from pydantic import BaseModel

class GetContract(BaseModel):
    type_id: int
    name: str