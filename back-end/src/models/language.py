from sqlmodel import SQLModel, Field, Relationship

class Language(SQLModel, table=True):
    __tablename__="idioma"
    language_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_idioma"})
    name: str = Field(max_length=100, sa_column_kwargs={"name": "nombre"})
    # Candidate Language Relationship
    candidate_languages: list["CandidateLanguage"] = Relationship(back_populates="language")