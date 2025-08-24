from sqlmodel import SQLModel, Field, Relationship

from .role_position import RolePosition

class GenericPosition(SQLModel, table=True):
    __tablename__="cargo_generico"
    position_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_cargo"})
    name: str = Field(max_length=50, sa_column_kwargs={"name": "nombre"})
    # Role Position Relationship
    role_id: int = Field(foreign_key="rol_cargo.id_rol", sa_column_kwargs={"name": "id_rol"})
    role_position: RolePosition = Relationship(back_populates="generic_positions")
    # Candidate Position Preference Relationship
    candidate_position_preferences: list["CandidatePositionPreference"] | None = Relationship(back_populates="generic_position")