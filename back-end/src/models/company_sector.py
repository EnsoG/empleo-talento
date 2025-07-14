from sqlmodel import SQLModel, Field, Relationship

class CompanySector(SQLModel, table=True):
    __tablename__="sector_empresarial"
    sector_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_sector"})
    name: str = Field(max_length=150, sa_column_kwargs={"name": "nombre"})
    # Company Relationship
    companies: list["Company"] = Relationship(back_populates="company_sector")