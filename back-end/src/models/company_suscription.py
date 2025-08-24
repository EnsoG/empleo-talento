from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

from .company import Company
from .company_plan import CompanyPlan

class CompanySuscription(SQLModel, table=True):
    __tablename__="suscripcion_empresa"
    suscription_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_suscripcion"})
    start_date: datetime = Field(sa_column_kwargs={"name": "fecha_inicio"})
    end_date: datetime = Field(sa_column_kwargs={"name": "fecha_fin"})
    state: str = Field(max_length=50, sa_column_kwargs={"name": "estado"})
    # Company Relationship
    company_id: int = Field(foreign_key="empresa.id_empresa", sa_column_kwargs={"name": "id_empresa"})
    company: Company = Relationship(back_populates="company_suscriptions")
    # Company Plan Relationship
    plan_id: int = Field(foreign_key="plan_empresa.id_plan", sa_column_kwargs={"name": "id_plan"})
    company_plan: CompanyPlan = Relationship(back_populates="company_suscriptions")
    # Company Payment Relationship
    company_payments: list["CompanyPayment"] = Relationship(back_populates="company_suscription")