from sqlmodel import SQLModel, Field
from sqlalchemy import Column, Text

class AdminUser(SQLModel, table=True):
    __tablename__="usuario_admin"
    admin_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_admin"})
    name: str = Field(max_length=150, sa_column_kwargs={"name": "nombre"})
    paternal: str = Field(max_length=150, sa_column_kwargs={"name": "paterno"})
    maternal: str | None = Field(max_length=150, sa_column_kwargs={"name": "materno"})
    email: str = Field(unique=True)
    password: str = Field(min_length=6, sa_column=Column(Text))