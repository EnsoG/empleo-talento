from sqlmodel import SQLModel, Field, Relationship

class Shift(SQLModel, table=True):
    __tablename__="turnos"
    shift_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_turno"})
    name: str = Field(max_length=50, sa_column_kwargs={"name": "nombre"})
    # Job Offer Relationship
    job_offers: list["JobOffer"] = Relationship(back_populates="shift")