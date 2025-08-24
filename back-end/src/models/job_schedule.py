from sqlmodel import SQLModel, Field, Relationship

class JobSchedule(SQLModel, table=True):
    __tablename__="horario_jornada"
    schedule_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_horario"})
    name: str = Field(max_items=50, sa_column_kwargs={"name": "nombre"})
    # Job Offer Relationship
    job_offers: list["JobOffer"] = Relationship(back_populates="job_schedule")