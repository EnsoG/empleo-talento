from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, Text

from .job_question import JobQuestion
from .postulation import Postulation

class JobAnswer(SQLModel, table=True):
    __tablename__="respuestas"
    answer_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_respuesta"})
    answer: str = Field(sa_column=Column("respuesta", Text))
    # Job Question Relationship
    question_id: int = Field(foreign_key="preguntas_oferta.id_pregunta", sa_column_kwargs={"name": "id_pregunta"})
    job_question: JobQuestion = Relationship(back_populates="job_answers")
    # Postulation Relationship
    postulation_id: int = Field(foreign_key="postulacion.id_postulacion", sa_column_kwargs={"name": "id_postulacion"})
    postulation: Postulation = Relationship(back_populates="job_answers")