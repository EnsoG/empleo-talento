from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, Text
from datetime import date

from .candidate import Candidate
from .certification_type import CertificationType

class CandidateCertification(SQLModel, table=True):
    __tablename__="certificacion_candidato"
    certification_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_certificacion"})
    name: str = Field(sa_column_kwargs={"name": "nombre"})
    institution: str | None = Field(default=None, sa_column_kwargs={"name": "institucion"})
    obtained_date: date | None = Field(default=None, sa_column_kwargs={"name": "fecha_obtencion"})
    expiration_date: date | None = Field(default=None, sa_column_kwargs={"name": "fecha_vencimiento"})
    description: str | None = Field(default=None, sa_column=Column("descripcion", Text))
    # Candidate Relationship
    candidate_id: int = Field(foreign_key="candidato.id_candidato")
    candidate: Candidate = Relationship(back_populates="candidate_certifications")
    # Certification Type Relationship
    certification_type_id: int = Field(foreign_key="tipo_certificacion.id_tipo_certificacion", sa_column_kwargs={"name": "id_tipo_certificacion"})
    certification_type: CertificationType = Relationship(back_populates="candidate_certifications")