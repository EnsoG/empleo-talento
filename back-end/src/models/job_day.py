from sqlmodel import SQLModel, Field, Relationship

class JobDay(SQLModel, table=True):
    __tablename__="dias_laborales"
    day_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_dia"})
    name: str = Field(max_length=150, sa_column_kwargs={"name": "nombre"})
    # Job Offer Relationship
    job_offers: list["JobOffer"] = Relationship(back_populates="job_day")