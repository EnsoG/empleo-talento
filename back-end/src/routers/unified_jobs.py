from fastapi import APIRouter, HTTPException, Query, status
from fastapi.responses import JSONResponse
from sqlmodel import select, or_
from datetime import date
from typing import Annotated

from config.db import SessionDep
from models.job_offer import JobOffer
from models.codelco_job import CodelcoJob
from models.company import Company

router = APIRouter(prefix="/unified-jobs", tags=["unified-jobs"])

@router.get("/all-including-external")
async def get_all_offers_including_external(
    session: SessionDep,
    page: Annotated[int, Query(gt=0)] = 1,
    search: Annotated[str | None, Query()] = None,
    region: Annotated[str | None, Query()] = None,
    limit: Annotated[int, Query(ge=1, le=100)] = 20
) -> JSONResponse:
    """
    Endpoint público que incluye tanto empleos regulares como empleos de Codelco
    para mostrar todo en el listado principal del portal
    """
    try:
        offset = (page - 1) * limit
        all_jobs = []
        
        # Obtener empleos regulares activos
        regular_jobs_query = select(JobOffer, Company.name.label("company_name")).join(
            Company, JobOffer.company_id == Company.company_id
        ).where(
            JobOffer.state == "active",
            JobOffer.publication_date <= date.today(),
            or_(
                JobOffer.closing_date >= date.today(),
                JobOffer.closing_date == None
            )
        )
        
        # Aplicar filtros
        if search:
            clean_search = search.strip()
            regular_jobs_query = regular_jobs_query.where(
                or_(
                    JobOffer.title.ilike(f"%{clean_search}%"),
                    JobOffer.description.ilike(f"%{clean_search}%")
                )
            )
        
        if region:
            regular_jobs_query = regular_jobs_query.where(JobOffer.location.ilike(f"%{region}%"))
        
        regular_result = await session.execute(regular_jobs_query.order_by(JobOffer.publication_date.desc()))
        regular_jobs = regular_result.all()
        
        # Formatear empleos regulares
        for job, company_name in regular_jobs:
            all_jobs.append({
                "id": f"regular_{job.offer_id}",
                "internal_id": job.offer_id,
                "title": job.title,
                "company_name": company_name,
                "location": job.location or "No especificada",
                "description": job.description or "Descripción no disponible",
                "requirements": job.requirements or "No especificados",
                "publication_date": job.publication_date.isoformat() if job.publication_date else None,
                "closing_date": job.closing_date.isoformat() if job.closing_date else None,
                "salary": job.salary,
                "years_experience": job.years_experience,
                "source_type": "internal",
                "source": "Portal",
                "can_apply_internal": True,
                "can_apply_external": False,
                "external_url": None,
                "is_featured": job.featured == 1,
                "position": job.position
            })
        
        # Obtener empleos de Codelco activos
        codelco_query = select(CodelcoJob).where(CodelcoJob.activo == True)
        
        # Aplicar filtros para Codelco
        if search:
            clean_search = search.strip()
            codelco_query = codelco_query.where(
                or_(
                    CodelcoJob.titulo.ilike(f"%{clean_search}%"),
                    CodelcoJob.descripcion.ilike(f"%{clean_search}%")
                )
            )
        
        if region:
            codelco_query = codelco_query.where(
                or_(
                    CodelcoJob.region.ilike(f"%{region}%"),
                    CodelcoJob.ubicacion.ilike(f"%{region}%")
                )
            )
        
        codelco_result = await session.execute(codelco_query.order_by(CodelcoJob.fecha_scraped.desc()))
        codelco_jobs = codelco_result.scalars().all()
        
        # Formatear empleos de Codelco
        for job in codelco_jobs:
            all_jobs.append({
                "id": f"codelco_{job.id}",
                "internal_id": job.id,
                "title": job.titulo,
                "company_name": "Codelco",
                "location": job.ubicacion,
                "description": job.descripcion or "Descripción no disponible",
                "requirements": job.requisitos or "No especificados",
                "publication_date": job.fecha_scraped.isoformat(),
                "closing_date": job.fecha,  # Fecha de cierre como string
                "salary": None,
                "years_experience": None,
                "source_type": "external",
                "source": "Codelco",
                "can_apply_internal": False,
                "can_apply_external": True,
                "external_url": job.url,
                "external_id": job.id_proceso,
                "is_featured": False,
                "position": job.titulo
            })
        
        # Ordenar todos los empleos por fecha de publicación (más recientes primero)
        all_jobs.sort(key=lambda x: x["publication_date"] or "", reverse=True)
        
        # Aplicar paginación
        total_jobs = len(all_jobs)
        paginated_jobs = all_jobs[offset:offset + limit]
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "detail": "All offers including external retrieved successfully",
                "jobs": paginated_jobs,
                "pagination": {
                    "page": page,
                    "limit": limit,
                    "total": total_jobs,
                    "total_pages": (total_jobs + limit - 1) // limit,
                    "has_next": offset + limit < total_jobs,
                    "has_prev": page > 1
                },
                "statistics": {
                    "total_jobs": total_jobs,
                    "internal_jobs": len([j for j in all_jobs if j["source_type"] == "internal"]),
                    "external_jobs": len([j for j in all_jobs if j["source_type"] == "external"]),
                    "codelco_jobs": len([j for j in all_jobs if j["source"] == "Codelco"])
                },
                "filters_applied": {
                    "search": search,
                    "region": region,
                    "page": page
                }
            }
        )
        
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while retrieving all offers: {str(ex)}"
        )
