from sqlmodel import SQLModel, Field, Relationship

class CertificationType(SQLModel, table=True):
    __tablename__="tipo_certificacion"
    certification_type_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_tipo_certificacion"})
    name: str = Field(max_length=100, sa_column_kwargs={"name": "nombre"})
    # Candidate Certification Relationship
    candidate_certifications: list["CandidateCertification"] = Relationship(back_populates="certification_type")