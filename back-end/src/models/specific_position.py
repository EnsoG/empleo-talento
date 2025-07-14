from sqlmodel import SQLModel, Field, Relationship

class SpecificPosition(SQLModel, table=True):
    __tablename__="cargo_especifico"
    specific_position_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_cargo_especifico"})
    name: str = Field(max_length=150, sa_column_kwargs={"name": "nombre"})
    position_id: int = Field(sa_column_kwargs={"name": "id_cargo_generico"})
    # Job Offer Relationship
    job_offers: list["JobOffer"] = Relationship(back_populates="specific_position")