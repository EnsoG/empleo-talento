from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

from .candidate_suscription import CandidateSuscription

class CandidatePayment(SQLModel, table=True):
    __tablename__="pago_candidato"
    payment_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_pago"})
    total: int = Field()
    payment_type: str = Field(max_length=50, sa_column_kwargs={"name": "forma_pago"})
    payment_date: datetime = Field(sa_column_kwargs={"name": "fecha_pago"})
    state: str = Field(max_length=50, sa_column_kwargs={"name": "estado"})
    transaction_id: int = Field(sa_column_kwargs={"name": "id_transaccion"})
    # Candidate Suscription Relationship
    suscription_id: int = Field(foreign_key="suscripcion_candidato.id_suscripcion", sa_column_kwargs={"name": "id_suscripcion"})
    candidate_suscription: CandidateSuscription = Relationship(back_populates="candidate_payments")