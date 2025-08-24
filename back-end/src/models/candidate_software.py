from sqlmodel import SQLModel, Field, Relationship

from .candidate import Candidate
from .software import Software
from .knownledge_level import KnownledgeLevel

class CandidateSoftware(SQLModel, table=True):
    __tablename__="software_candidato"
    candidate_software_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_software_candidato"})
    # Candidate Relationship
    candidate_id: int = Field(foreign_key="candidato.id_candidato")
    candidate: Candidate = Relationship(back_populates="candidate_softwares")
    # Software Relationship
    software_id: int = Field(foreign_key="software.id_software", sa_column_kwargs={"name": "id_software"})
    software: Software = Relationship(back_populates="candidate_softwares")
    # Knownledge Level Relationship
    level_id: int = Field(foreign_key="nivel_conocimiento.id_nivel", sa_column_kwargs={"name": "id_nivel"})
    knownledge_level: KnownledgeLevel = Relationship(back_populates="candidate_softwares")