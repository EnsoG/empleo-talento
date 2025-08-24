from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

from .alert_frequency import AlertFrequency
from .candidate import Candidate

class CandidateAlertConfiguration(SQLModel, table=True):
    __tablename__="configuracion_alertas_candidato"
    configuration_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_configuracion"})
    active_alerts: int = Field(default=1, sa_column_kwargs={"name": "alertas_activas"})
    email_alerts: str | None = Field(default=None, sa_column_kwargs={"name": "email_alertas"})
    last_alert_sent: datetime | None = Field(default=None, sa_column_kwargs={"name": "ultima_alerta_enviada"})
    next_alert: datetime | None = Field(default=None, sa_column_kwargs={"name": "proxima_alerta"})
    creation_date: datetime = Field(default_factory=datetime.today, sa_column_kwargs={"name": "fecha_creacion"})
    update_date: datetime | None = Field(default=None, sa_column_kwargs={"name": "fecha_actualizacion"})
    # Alert Frequency Relationship
    frequency_id: int = Field(foreign_key="frecuencia_alerta.id_frecuencia", sa_column_kwargs={"name": "id_frecuencia"})
    alert_frequency: AlertFrequency = Relationship(back_populates="candidate_alert_configurations")
    # Candidate Relationship
    candidate_id: int = Field(foreign_key="candidato.id_candidato", sa_column_kwargs={"name": "id_candidato"})
    candidate: Candidate = Relationship(back_populates="candidate_alert_configurations")