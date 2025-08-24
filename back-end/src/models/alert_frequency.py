from sqlmodel import SQLModel, Field, Relationship

class AlertFrequency(SQLModel, table=True):
    __tablename__="frecuencia_alerta"
    frequency_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_frecuencia"})
    name: str = Field(max_length=50, sa_column_kwargs={"name": "nombre"})
    days: int = Field(sa_column_kwargs={"name": "dias"})
    description: str | None = Field(default=None, max_length=100)
    # Candidate Alert Configuration Relationship
    candidate_alert_configurations: list["CandidateAlertConfiguration"] = Relationship(back_populates="alert_frequency")