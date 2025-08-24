from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, Text

from .company import Company

class CompanyUser(SQLModel, table=True):
    __tablename__="usuario_empresa"
    user_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_usuario"})
    name: str = Field(max_length=150, sa_column_kwargs={"name": "nombre"})
    paternal: str = Field(max_length=150, sa_column_kwargs={"name": "paterno"})
    maternal: str | None = Field(default=None, max_length=150, sa_column_kwargs={"name": "materno"})
    position: str = Field(max_length=300, sa_column_kwargs={"name": "cargo"})
    phone: str = Field(max_length=15, sa_column_kwargs={"name": "fono"})
    email: str = Field(max_length=255, unique=True)
    password: str = Field(min_length=6, sa_column=Column(Text))
    state: int = Field(sa_column_kwargs={"name": "estado"})
    # Company Relationship
    company_id: int = Field(foreign_key="empresa.id_empresa", sa_column_kwargs={"name": "id_empresa"})
    company: Company = Relationship(back_populates="company_users")
    # Password Reset Relationship
    password_resets: list["PasswordReset"] = Relationship(back_populates="company_user")