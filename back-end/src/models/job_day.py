from sqlmodel import SQLModel, Field, Relationship

from .shift import Shift

class JobDay(SQLModel, table=True):
    __tablename__="dias_laborales"
    day_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_dia"})
    name: str = Field(max_length=150, sa_column_kwargs={"name": "nombre"})
    # Shift Relationship
    shift_id: int = Field(foreign_key="turnos.id_turno", sa_column_kwargs={"name": "id_turno"})
    shift: Shift = Relationship(back_populates="job_days")