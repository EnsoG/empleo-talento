from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, Text
from datetime import date, datetime

from .driver_license import DriverLicense

class Candidate(SQLModel, table=True):
    __tablename__="candidato"
    candidate_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_candidato"})
    run: str | None = Field(default=None, max_length=13, unique=True)
    name: str = Field(max_length=150, sa_column_kwargs={"name": "nombre"})
    paternal: str = Field(max_length=150, sa_column_kwargs={"name": "paterno"})
    maternal: str | None = Field(default=None, max_length=150, sa_column_kwargs={"name": "materno"})
    birth_date: date | None = Field(default=None, sa_column_kwargs={"name": "fecha_nacimiento"})
    gender: str | None = Field(default=None, max_length=50, sa_column_kwargs={"name": "sexo"})
    nationality: str | None = Field(default=None, max_length=150, sa_column_kwargs={"name": "nacionalidad"})
    featured_study: str | None = Field(default=None, max_length=300, sa_column_kwargs={"name": "estudio_destacado"})
    phone: str | None = Field(default=None, max_length=15, sa_column_kwargs={"name": "fono"})
    email: str = Field(unique=True)
    password: str | None = Field(default=None, min_length=6 ,sa_column=Column(Text))
    photo: str | None = Field(default=None, sa_column=Column("foto", Text))
    resume: str | None = Field(default=None, sa_column=Column("cv", Text))
    last_connection: datetime | None = Field(default=None, sa_column_kwargs={"name": "ultima_conexion"})
    # Driver License Relationship
    license_id: int | None = Field(foreign_key="licencia_conducir.id_licencia", default=None, sa_column_kwargs={"name": "id_licencia"})
    driver_license: DriverLicense | None = Relationship(back_populates="candidates")
    # Candidate Study Relationship
    candidate_studies: list["CandidateStudy"] = Relationship(back_populates="candidate")
    # Candidate Suscription Relationship
    candidate_suscriptions: list["CandidateSuscription"] = Relationship(back_populates="candidate")
    # Postulation Relationship
    postulations: list["Postulation"] = Relationship(back_populates="candidate")
    # Work Experience Relationship
    work_experiences: list["WorkExperience"] = Relationship(back_populates="candidate")
    # Candidate Language Relationship
    candidate_languages: list["CandidateLanguage"] = Relationship(back_populates="candidate")
    # Candidate Certification Relationship
    candidate_certifications: list["CandidateCertification"] = Relationship(back_populates="candidate")
    # Candidate Software Relationship
    candidate_softwares: list["CandidateSoftware"] = Relationship(back_populates="candidate")
    # Candidate Alert Configuration Relationship
    candidate_alert_configurations: list["CandidateAlertConfiguration"] = Relationship(back_populates="candidate")
    # Candidate Position Preference Relationship
    candidate_position_preference: "CandidatePositionPreference" = Relationship(back_populates="candidate")
    # Password Reset Relationship
    password_resets: list["PasswordReset"] = Relationship(back_populates="candidate")