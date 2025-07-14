from sqlmodel import SQLModel, Field, Relationship

from .job_type import JobType

class Shift(SQLModel, table=True):
    __tablename__="turnos"
    shift_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_turno"})
    name: str = Field(max_length=50, sa_column_kwargs={"name": "nombre"})
    # Job Type Relationship
    job_type_id: int = Field(foreign_key="jornada.id_jornada", sa_column_kwargs={"name": "id_jornada"})
    job_type: JobType = Relationship(back_populates="shifts")
    # Job Day Relationship
    job_days: list["JobDay"] = Relationship(back_populates="shift")