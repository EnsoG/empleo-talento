from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, Text
from datetime import date

from .specific_position import SpecificPosition
from .performance_area import PerformanceArea
from .city import City
from .company import Company
from .contract_type import ContractType
from .job_type import JobType
from .job_schedule import JobSchedule
from .shift import Shift
from .job_day import JobDay

class JobOffer(SQLModel, table=True):
    __tablename__="oferta"
    offer_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_oferta"})
    code: int = Field(sa_column_kwargs={"name": "codigo"})
    title: str = Field(sa_column_kwargs={"name": "titulo"})
    position: str | None = Field(default=None, max_length=150, sa_column_kwargs={"name": "cargo"})
    description: str | None = Field(default=None, sa_column=Column("descripcion", Text))
    requirements: str | None = Field(default=None, sa_column=Column("requisitos", Text))
    years_experience: str | None = Field(default=None, max_length=50, sa_column_kwargs={"name": "anos_experiencia"})
    salary: int | None = Field(default=None, sa_column_kwargs={"name": "salario"})
    location: str | None = Field(default=None, max_length=300, sa_column_kwargs={"name": "lugar"})
    publication_date: date = Field(sa_column_kwargs={"name": "fecha_publicacion"})
    closing_date: date | None = Field(default=None, sa_column_kwargs={"name": "fecha_cierre"})
    state: str = Field(max_length=50, sa_column_kwargs={"name": "estado"})
    featured: int = Field(sa_column_kwargs={"name": "destacada"})
    # Speficic Position Relationship
    specific_position_id: int | None = Field(foreign_key="cargo_especifico.id_cargo_especifico", default=None, sa_column_kwargs={"name": "id_cargo_especifico"})
    specific_position: SpecificPosition = Relationship(back_populates="job_offers")
    # Area Performance Relationship
    area_id: int | None = Field(foreign_key="area_desempeno.id_area", default=None, sa_column_kwargs={"name": "id_area"})
    performance_area: PerformanceArea | None = Relationship(back_populates="job_offers")
    # City Relationship
    city_id: int | None = Field(foreign_key="ciudad.id_ciudad", default=None, sa_column_kwargs={"name": "id_ciudad"})
    city: City | None = Relationship(back_populates="job_offers")
    # Company Relationship
    company_id: int | None = Field(foreign_key="empresa.id_empresa", default=None, sa_column_kwargs={"name": "id_empresa"})
    company: Company | None = Relationship(back_populates="job_offers")
    # Contract Type Relationship
    type_id: int | None = Field(foreign_key="tipo_contrato.id_tipo", default=None, sa_column_kwargs={"name": "id_contrato"})
    contract_type: ContractType | None = Relationship(back_populates="job_offers")
    # Job Type Relationship
    job_type_id: int | None = Field(foreign_key="jornada.id_jornada", default=None, sa_column_kwargs={"name": "id_jornada"})
    job_type: JobType | None = Relationship(back_populates="job_offers")
    # Job Schedule Relationship
    schedule_id: int | None = Field(foreign_key="horario_jornada.id_horario", default=None, sa_column_kwargs={"name": "id_horario"})
    job_schedule: JobSchedule | None = Relationship(back_populates="job_offers")
    # Shift Relationship
    shift_id: int | None = Field(foreign_key="turnos.id_turno", default=None, sa_column_kwargs={"name": "id_turno"})
    shift: Shift | None = Relationship(back_populates="job_offers")
    # JobDay Relationship
    day_id: int | None = Field(foreign_key="dias_laborales.id_dia", default=None, sa_column_kwargs={"name": "id_dia"})
    job_day: JobDay | None = Relationship(back_populates="job_offers")
    # Job Question Relationship
    job_questions: list["JobQuestion"] = Relationship(back_populates="job_offer")
    # Postulation Relationship
    postulations: list["Postulation"] = Relationship(back_populates="job_offer")