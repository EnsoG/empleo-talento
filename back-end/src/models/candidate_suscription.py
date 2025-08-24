from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

from .candidate import Candidate
from .candidate_plan import CandidatePlan

class CandidateSuscription(SQLModel, table=True):
    __tablename__="suscripcion_candidato"
    suscription_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_suscripcion"})
    start_date: datetime = Field(sa_column_kwargs={"name": "fecha_inicio"})
    end_date: datetime = Field(sa_column_kwargs={"name": "fecha_fin"})
    state: str = Field(max_length=50, sa_column_kwargs={"name": "estado"})
    # Candidate Relationship
    candidate_id: int = Field(foreign_key="candidato.id_candidato")
    candidate: Candidate = Relationship(back_populates="candidate_suscriptions")
    # Candidate Plan Relationship
    plan_id: int = Field(foreign_key="plan_candidato.id_plan", sa_column_kwargs={"name": "id_plan"})
    candidate_plan: CandidatePlan = Relationship(back_populates="candidate_suscriptions")
    # Candidate Payment Relationship
    candidate_payments: list["CandidatePayment"] = Relationship(back_populates="candidate_suscription")