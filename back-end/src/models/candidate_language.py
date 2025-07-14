from sqlmodel import SQLModel, Field, Relationship

from .candidate import Candidate
from .language_level import LanguageLevel
from .language import Language

class CandidateLanguage(SQLModel, table=True):
    __tablename__="idioma_candidato"
    candidate_language_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_idioma_candidato"})
    # Candidate Relationship
    candidate_id: int = Field(foreign_key="candidato.id_candidato")
    candidate: Candidate = Relationship(back_populates="candidate_languages")
    # Language Level Relationship
    level_id: int = Field(foreign_key="nivel_idioma.id_nivel", sa_column_kwargs={"name": "id_nivel"})
    language_level: LanguageLevel = Relationship(back_populates="candidate_languages")
    # Language Relationship
    language_id: int = Field(foreign_key="idioma.id_idioma", sa_column_kwargs={"name": "id_idioma"})
    language: Language = Relationship(back_populates="candidate_languages")