from sqlmodel import SQLModel, Field, Relationship

class JobType(SQLModel, table=True):
    __tablename__="jornada"
    job_type_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_jornada"})
    name: str = Field(max_length=50, sa_column_kwargs={"name": "nombre"})
    # Job Offer Relationship
    job_offers: list["JobOffer"] = Relationship(back_populates="job_type")
    # Candidate Position Preference Relationship
    candidate_position_preferences: list["CandidatePositionPreference"] | None = Relationship(back_populates="job_type")