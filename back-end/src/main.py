import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

from config.db import close_db
from config.settings import get_settings
from routers import (
    admin_users,
    admin,
    auth,
    candidates,
    candidate_studies,
    candidate_certifications,
    candidate_languages,
    candidate_softwares,
    work_experiences,
    companies,
    company_users,
    job_offers,
    postulations,
    publications,
    softwares,
    job_schedules,
    candidate_plans,
    company_plans,
    languages,
    company_sectors,
    certification_types,
    performance_areas,
    role_positions,
    generic_positions,
    metadata,
    scrapers,
    unified_jobs
)

# LifeSpan Server Cycle
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup Actions
    yield
    # Shutdown Actions
    await close_db()

app = FastAPI(lifespan=lifespan) # Create Server Instance
# Configure CORS
settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.front_end_domain],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Mount Static Files
app.mount(
    "/v1/uploads",
    StaticFiles(directory=os.path.join(os.path.dirname(__file__), "uploads")),
    name="uploads"
)

# App Routers
app.include_router(admin_users.router, prefix="/v1")
app.include_router(admin.router, prefix="/v1")
app.include_router(auth.router, prefix="/v1")
app.include_router(candidates.router, prefix="/v1")
app.include_router(candidate_studies.router, prefix="/v1")
app.include_router(candidate_certifications.router, prefix="/v1")
app.include_router(candidate_languages.router, prefix="/v1")
app.include_router(candidate_softwares.router, prefix="/v1")
app.include_router(work_experiences.router, prefix="/v1")
app.include_router(companies.router, prefix="/v1")
app.include_router(company_users.router, prefix="/v1")
app.include_router(job_offers.router, prefix="/v1")
app.include_router(postulations.router, prefix="/v1")
app.include_router(publications.router, prefix="/v1")
app.include_router(softwares.router, prefix="/v1")
app.include_router(job_schedules.router, prefix="/v1")
app.include_router(candidate_plans.router, prefix="/v1")
app.include_router(company_plans.router, prefix="/v1")
app.include_router(languages.router, prefix="/v1")
app.include_router(company_sectors.router, prefix="/v1")
app.include_router(certification_types.router, prefix="/v1")
app.include_router(performance_areas.router, prefix="/v1")
app.include_router(role_positions.router, prefix="/v1")
app.include_router(generic_positions.router, prefix="/v1")
app.include_router(metadata.router, prefix="/v1")
app.include_router(scrapers.router, prefix="/v1")
app.include_router(unified_jobs.router, prefix="/v1")