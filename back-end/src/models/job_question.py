from sqlmodel import SQLModel, Field, Relationship

from .job_offer import JobOffer

class JobQuestion(SQLModel, table=True):
    __tablename__="preguntas_oferta"
    question_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_pregunta"})
    question: str = Field(sa_column_kwargs={"name": "pregunta"})
    question_type: int = Field(sa_column_kwargs={"name": "tipo_pregunta"})
    # Job Offer Relationship
    offer_id: int = Field(foreign_key="oferta.id_oferta", sa_column_kwargs={"name": "id_oferta"})
    job_offer: JobOffer = Relationship(back_populates="job_questions")
    # Job Answer Relationship
    job_answers: list["JobAnswer"] = Relationship(back_populates="job_question")