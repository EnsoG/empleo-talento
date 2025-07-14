from sqlmodel import SQLModel, Field, Relationship

class Region(SQLModel, table=True):
    __tablename__="region"
    number_region: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "numero_region"})
    name: str = Field(max_length=150, sa_column_kwargs={"name": "nombre"})
    # City Relationship
    cities: list["City"] = Relationship(back_populates="region")