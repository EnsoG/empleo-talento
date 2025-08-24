from sqlmodel import SQLModel, Field, Relationship

class ContractType(SQLModel, table=True):
    __tablename__="tipo_contrato"
    type_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_tipo"})
    name: str = Field(max_length=150, sa_column_kwargs={"name": "nombre"})
    # Job Offer Relationship
    job_offers: list["JobOffer"] = Relationship(back_populates="contract_type")
    # Candidate Position Preference Relationship
    candidate_position_preferences: list["CandidatePositionPreference"] | None = Relationship(back_populates="contract_type")