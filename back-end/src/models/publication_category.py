from sqlmodel import SQLModel, Field, Relationship

class PublicationCategory(SQLModel, table=True):
    __tablename__="categoria_publicacion"
    category_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_categoria"})
    name: str = Field(max_length=50, sa_column_kwargs={"name": "nombre"})
    # Publication Relationship
    publications: list["Publication"] = Relationship(back_populates="publication_category")