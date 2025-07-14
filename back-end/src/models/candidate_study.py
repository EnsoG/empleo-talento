from sqlmodel import SQLModel, Field, Relationship
from datetime import date

from .candidate import Candidate

class CandidateStudy(SQLModel, table=True):
    __tablename__="estudios_candidato"
    study_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_estudio"})
    title: str = Field(sa_column_kwargs={"name": "titulo"})
    institution: str = Field(sa_column_kwargs={"name": "institucion"})
    start_date: date = Field(sa_column_kwargs={"name": "fecha_inicio"})
    end_date: date | None = Field(default=None, sa_column_kwargs={"name": "fecha_fin"})
    # Candidate Relationship
    candidate_id: int = Field(foreign_key="candidato.id_candidato")
    candidate: Candidate = Relationship(back_populates="candidate_studies")