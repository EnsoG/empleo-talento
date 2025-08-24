from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, Text

from .company_sector import CompanySector

class Company(SQLModel, table=True):
    __tablename__ = "empresa"
    company_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_empresa"})
    rut: str = Field(max_length=13)
    legal_name: str = Field(max_length=300, sa_column_kwargs={"name": "razon_social"})
    trade_name: str = Field(max_length=300, sa_column_kwargs={"name": "nombre_fantasia"})
    web: str | None = Field(default=None, max_length=300)
    email: str = Field(max_length=300, unique=True)
    description: str | None = Field(sa_column=Column("descripcion", Text))
    phone: str = Field(max_length=15, sa_column_kwargs={"name": "fono"})
    logo: str | None = Field(default=None, sa_column=Column(Text))
    # Company Sector Relationship
    sector_id: int | None = Field(foreign_key="sector_empresarial.id_sector", default=None, sa_column_kwargs={"name": "id_sector"})
    company_sector: CompanySector | None = Relationship(back_populates="companies")
    # Company Suscription Relationship
    company_suscriptions: list["CompanySuscription"] = Relationship(back_populates="company")
    # Company User Relationship
    company_users: list["CompanyUser"] = Relationship(back_populates="company")
    # Job Offer Relationship
    job_offers: list["JobOffer"] = Relationship(back_populates="company")