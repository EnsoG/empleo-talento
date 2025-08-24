from fastapi import Depends
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.engine import URL
from sqlalchemy.orm import sessionmaker
from typing import Annotated

from .settings import get_settings
from models import (
    admin_user,
    candidate_certification,
    candidate_language,
    candidate_payment,
    candidate_plan,
    candidate_software,
    candidate_study,
    candidate_suscription,
    candidate,
    certification_type,
    city,
    company_payment,
    company_plan,
    company_sector,
    company_suscription,
    company_user,
    company,
    contract_type,
    driver_license,
    generic_position,
    job_answer,
    job_day,
    job_offer,
    job_question,
    job_schedule,
    job_type,
    knownledge_level,
    language_level,
    language,
    password_reset,
    performance_area,
    postulation,
    publication_category,
    publication,
    region,
    role_position,
    shift,
    software,
    specific_position,
    alert_frequency,
    candidate_alert_configuration,
    candidate_position_preference,
    work_experience
)

settings = get_settings()

db_url = URL.create(
    "mysql+asyncmy",
    username=settings.db_username,
    password=settings.db_password,
    host=settings.db_host,
    database=settings.db_name
)

engine = create_async_engine(db_url, echo=False)
async_session = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

async def get_session():
    async with async_session() as session:
        yield session

async def close_db():
    await engine.dispose()

SessionDep = Annotated[AsyncSession, Depends(get_session)]