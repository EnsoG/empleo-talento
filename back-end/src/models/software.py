from sqlmodel import SQLModel, Field, Relationship

class Software(SQLModel, table=True):
    __tablename__="software"
    software_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_software"})
    name: str = Field(max_length=150, sa_column_kwargs={"name": "nombre"})
    # Candidate Software Relationship
    candidate_softwares: list["CandidateSoftware"] = Relationship(back_populates="software")