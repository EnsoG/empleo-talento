from sqlmodel import SQLModel, Field, Relationship

from .region import Region

class City(SQLModel, table=True):
    __tablename__="ciudad"
    city_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_ciudad"})
    name: str = Field(max_length=150, sa_column_kwargs={"name": "nombre"})
    # Region Relationship
    region_id: int = Field(foreign_key="region.numero_region", sa_column_kwargs={"name": "id_region"})
    region: Region = Relationship(back_populates="cities")
    # Job Offer Relationship
    job_offers: list["JobOffer"] = Relationship(back_populates="city")
    # Candidate Position Preference Relationship
    candidate_position_preferences: list["CandidatePositionPreference"] | None = Relationship(back_populates="city")