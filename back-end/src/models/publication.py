from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, Text
from datetime import date

from .publication_category import PublicationCategory

class Publication(SQLModel, table=True):
    __tablename__="publicacion"
    publication_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_publicacion"})
    title: str = Field(max_length=100, sa_column_kwargs={"name": "titulo"})
    description: str = Field(sa_column=Column("descripcion", Text))
    creation_date: date = Field(default_factory=date.today, sa_column_kwargs={"name" : "fecha_creacion"})
    image: str = Field(default=None, sa_column=Column("imagen", Text))
    state: str = Field(max_length=50, sa_column_kwargs={"name": "estado"})
    # Publication Category Relationship
    category_id: int = Field(foreign_key="categoria_publicacion.id_categoria", sa_column_kwargs={"name": "id_categoria"})
    publication_category: PublicationCategory = Relationship(back_populates="publications")