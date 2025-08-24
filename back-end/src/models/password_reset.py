from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

from .candidate import Candidate
from .company_user import CompanyUser

class PasswordReset(SQLModel, table=True):
    __tablename__="restablecer_password"
    request_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_solicitud"})
    token: str = Field(unique=True, index=True)
    expiration_date: datetime = Field(sa_column_kwargs={"name": "fecha_vencimiento"})
    used: int = Field(default=0, sa_column_kwargs={"name": "usado"})
    # Candidate Relationship
    candidate_id: int | None = Field(foreign_key="candidato.id_candidato", default=None)
    candidate: Candidate | None = Relationship(back_populates="password_resets")
    # Company User Relationship
    user_id: int | None = Field(foreign_key="usuario_empresa.id_usuario", default=None, sa_column_kwargs={"name": "id_usuario"})
    company_user: CompanyUser | None = Relationship(back_populates="password_resets") 