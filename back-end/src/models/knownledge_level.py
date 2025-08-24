from sqlmodel import SQLModel, Field, Relationship

class KnownledgeLevel(SQLModel, table=True):
    __tablename__="nivel_conocimiento"
    level_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_nivel"})
    name: str = Field(max_length=50, sa_column_kwargs={"name": "nombre"})
    # Candidate Software Relationship
    candidate_softwares: list["CandidateSoftware"] = Relationship(back_populates="knownledge_level")