from sqlmodel import SQLModel, Field, Relationship

class LanguageLevel(SQLModel, table=True):
    __tablename__ = "nivel_idioma"
    level_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_nivel"})
    name: str = Field(max_length=50, sa_column_kwargs={"name": "nombre"})
    # Candidate Relationship
    candidate_languages: list["CandidateLanguage"] = Relationship(back_populates="language_level")