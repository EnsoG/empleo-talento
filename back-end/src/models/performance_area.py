from sqlmodel import SQLModel, Field, Relationship

class PerformanceArea(SQLModel, table=True):
    __tablename__="area_desempeno"
    area_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_area"})
    name: str = Field(max_length=150, sa_column_kwargs={"name": "nombre"})
    # Job Offer Relationship
    job_offers: list["JobOffer"] = Relationship(back_populates="performance_area")
    # Candidate Position Preference Relationship
    candidate_position_preferences: list["CandidatePositionPreference"] | None = Relationship(back_populates="performance_area")