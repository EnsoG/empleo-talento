from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, Text

class CompanyPlan(SQLModel, table=True):
    __tablename__="plan_empresa"
    plan_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_plan"})
    name: str = Field(max_length=50, sa_column_kwargs={"name": "nombre"})
    value: int = Field(sa_column_kwargs={"name": "valor"})
    description: str = Field(sa_column=Column("descripcion", Text))
    state: str = Field(max_length=50, sa_column_kwargs={"name": "estado"})
    photo: str = Field(sa_column=Column("foto", Text))
    # Company Suscription Relationship
    company_suscriptions: list["CompanySuscription"] = Relationship(back_populates="company_plan")