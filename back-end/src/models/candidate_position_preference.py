from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

from .candidate import Candidate
from .generic_position import GenericPosition
from .performance_area import PerformanceArea
from .city import City
from .contract_type import ContractType
from .job_type import JobType

class CandidatePositionPreference(SQLModel, table=True):
    __tablename__="preferencias_cargo_candidato"
    preference_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_preferencia"})
    min_wage: int | None = Field(sa_column_kwargs={"name": "salario_minimo"})
    max_wage: int | None = Field(sa_column_kwargs={"name": "salario_maximo"})
    years_min_experience: str | None = Field(max_length=50, sa_column_kwargs={"name": "anos_experiencia_minima"})
    active: int = Field(default=1, sa_column_kwargs={"name": "activa"})
    creation_date: datetime = Field(default_factory=datetime.today, sa_column_kwargs={"name": "fecha_creacion"})
    update_date: datetime | None = Field(default=None, sa_column_kwargs={"name": "fecha_actualizacion"})
    # Candidate Relationship
    candidate_id: int = Field(foreign_key="candidato.id_candidato", sa_column_kwargs={"name": "id_candidato"})
    candidate: Candidate = Relationship(back_populates="candidate_position_preference")
    # Generic Position Relationship
    position_id: int | None = Field(default=None, foreign_key="cargo_generico.id_cargo", sa_column_kwargs={"name": "id_cargo"})
    generic_position: GenericPosition | None = Relationship(back_populates="candidate_position_preferences")
    # Performance Area Relationship
    area_id: int | None = Field(default=None, foreign_key="area_desempeno.id_area", sa_column_kwargs={"name": "id_area"})
    performance_area: PerformanceArea | None = Relationship(back_populates="candidate_position_preferences")
    # City Relationship
    city_id: int | None = Field(default=None, foreign_key="ciudad.id_ciudad", sa_column_kwargs={"name": "id_ciudad"})
    city: City | None = Relationship(back_populates="candidate_position_preferences")
    # Contract Type Relationship
    type_id: int | None = Field(default=None, foreign_key="tipo_contrato.id_tipo", sa_column_kwargs={"name": "id_tipo"})
    contract_type: ContractType | None = Relationship(back_populates="candidate_position_preferences")
    # Job Type Relationship
    job_type_id: int | None = Field(default=None, foreign_key="jornada.id_jornada", sa_column_kwargs={"name": "id_jornada"})
    job_type: JobType | None = Relationship(back_populates="candidate_position_preferences")