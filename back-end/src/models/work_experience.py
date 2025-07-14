from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, Text
from datetime import date

from .candidate import Candidate

class WorkExperience(SQLModel, table=True):
    __tablename__="experiencia_laboral"
    experience_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_experiencia"})
    position: str = Field(max_length=150, sa_column_kwargs={"name": "cargo"})
    company: str | None = Field(default=None, sa_column_kwargs={"name": "empresa"})
    description: str | None = Field(default=None, sa_column=Column("descripcion", Text))
    start_date: date = Field(sa_column_kwargs={"name": "fecha_inicio"})
    end_date: date | None = Field(default=None, sa_column_kwargs={"name": "fecha_fin"})
    # Candidate Relationship
    candidate_id: int = Field(foreign_key="candidato.id_candidato")
    candidate: Candidate = Relationship(back_populates="work_experiences")