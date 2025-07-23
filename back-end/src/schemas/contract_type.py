from pydantic import BaseModel, ConfigDict, field_validator
from utilities import validate_empty_string

class BaseContract(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )

class GetContract(BaseModel):
    type_id: int
    name: str

class GetContracts(BaseModel):
    total_contracts: int
    contract_types: list[GetContract]

class CreateContract(BaseContract):
    name: str

    @field_validator("name")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value

class UpdateContract(BaseContract):
    name: str = ""

    @field_validator("name")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value