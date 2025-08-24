from sqlmodel import SQLModel, Field, Relationship
from datetime import date

from .candidate import Candidate
from .job_offer import JobOffer

class Postulation(SQLModel, table=True):
    __tablename__ = "postulacion"
    postulation_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_postulacion"})
    postulation_date: date = Field(default_factory=date.today, sa_column_kwargs={"name": "fecha_postulacion"})
    state: str = Field(max_length=30, sa_column_kwargs={"name": "estado"})
    # Candidate Relationship
    candidate_id: int = Field(foreign_key="candidato.id_candidato")
    candidate: Candidate = Relationship(back_populates="postulations")
    # Job Offer Relationship
    offer_id: int = Field(foreign_key="oferta.id_oferta", sa_column_kwargs={"name": "id_oferta"})
    job_offer: JobOffer = Relationship(back_populates="postulations")
    # Job Answer Relationship
    job_answers: list["JobAnswer"] = Relationship(back_populates="postulation")