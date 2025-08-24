from sqlmodel import SQLModel, Field, Relationship

class RolePosition(SQLModel, table=True):
    __tablename__="rol_cargo"
    role_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_rol"})
    name: str = Field(max_length=150, sa_column_kwargs={"name": "nombre"})
    # Generic Position Relationship
    generic_positions: list["GenericPosition"] = Relationship(back_populates="role_position")