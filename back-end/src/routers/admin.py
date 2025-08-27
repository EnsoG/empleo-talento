from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks, status, Query
from fastapi.responses import JSONResponse
from sqlmodel import select, union_all
from typing import Dict, Any, List
from datetime import datetime

from config.db import SessionDep
from models.admin_user import AdminUser
from models.codelco_job import CodelcoJob
from models.job_offer import JobOffer
from models.company import Company
from models.scraping_progress import codelco_progress, get_codelco_progress, reset_codelco_progress
from scrapers.codelco_scraper import CodelcoScraper
from utilities import get_current_user

router = APIRouter(prefix="/admin", tags=["admin"])

async def get_current_admin_user(
    session: SessionDep,
    current_user: dict = Depends(get_current_user)
) -> dict:
    """
    Dependency para verificar que el usuario actual es administrador
    """
    try:
        user_id = current_user.get("sub")
        admin_user = await session.get(AdminUser, user_id)
        
        if not admin_user:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied. Administrator privileges required"
            )
        
        return current_user
    except HTTPException:
        raise
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while verifying admin privileges"
        )

@router.get("/codelco/test")
async def test_codelco_scraper_admin(
    current_admin: dict = Depends(get_current_admin_user)
):
    """Prueba la conexión y funcionalidad básica del scraper de Codelco - Versión admin"""
    try:
        scraper = CodelcoScraper()
        
        # Probar conexión
        import aiohttp
        async with aiohttp.ClientSession() as session:
            html = await scraper.fetch_page(session, scraper.search_url)
            
            if html:
                # Extraer solo los primeros empleos para prueba
                jobs = scraper.extract_job_links_and_basic_info(html)
                
                return {
                    "status": "success",
                    "message": "Scraper funcionando correctamente",
                    "page_size": len(html),
                    "jobs_found": len(jobs),
                    "sample_jobs": jobs[:3] if jobs else []
                }
            else:
                raise HTTPException(status_code=500, detail="No se pudo acceder al sitio web")
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en el scraper: {str(e)}")

@router.post("/codelco/run")
async def run_codelco_scraper_admin(
    background_tasks: BackgroundTasks,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Ejecuta el scraper completo de Codelco en segundo plano - Método simple del lado público"""
    
    async def scrape_task():
        """Tarea de scraping en segundo plano - versión simple"""
        try:
            scraper = CodelcoScraper()
            result = await scraper.scrape_and_save()
            
            if result["success"]:
                print(f"Scraping completado: {result['jobs_count']} empleos encontrados")
                print(f"Base de datos: {result['db_saved_count']} empleos guardados")
            else:
                print("No se encontraron empleos en el scraping")
                
        except Exception as e:
            print(f"Error en scraping en segundo plano: {e}")
    
    # Ejecutar en segundo plano
    background_tasks.add_task(scrape_task)
    
    return {
        "status": "started",
        "message": "Scraping iniciado en segundo plano",
        "note": "Los resultados se guardarán en la base de datos"
    }

@router.post("/codelco/scraping/execute")
async def execute_codelco_scraping(
    session: SessionDep,
    background_tasks: BackgroundTasks,
    current_admin: dict = Depends(get_current_admin_user)
) -> JSONResponse:
    """
    Endpoint exclusivo para administradores para ejecutar el scraping de Codelco
    con seguimiento de progreso y fallback simple
    """
    try:
        # Verificar si ya hay un scraping en ejecución
        current_progress = await get_codelco_progress()
        if current_progress["is_running"]:
            return {
                "status": "running",
                "message": "Ya hay un proceso de scraping en ejecución",
                "current_progress": current_progress
            }
        
        async def scraping_task():
            """Tarea de scraping en segundo plano con progreso y fallback simple"""
            try:
                # Resetear progreso anterior
                await reset_codelco_progress()
                
                # Intentar scraping con seguimiento de progreso
                scraper = CodelcoScraper()
                result = await scraper.scrape_and_save_with_progress(
                    progress_tracker=codelco_progress
                )
                
                if result["success"]:
                    print(f"✅ Scraping Codelco completado: {result['jobs_count']} empleos encontrados")
                    print(f"📊 Base de datos: {result['db_saved_count']} empleos guardados")
                else:
                    print("⚠️ No se encontraron empleos en el scraping de Codelco")
                    if "error" in result:
                        print(f"❌ Error: {result['error']}")
                    
            except Exception as e:
                print(f"❌ Error en scraping con progreso: {e}")
                print("🔄 Intentando con método simple...")
                
                # Fallback: usar método simple del lado público
                try:
                    scraper = CodelcoScraper()
                    result = await scraper.scrape_and_save()
                    
                    if result["success"]:
                        print(f"✅ Scraping simple completado: {result['jobs_count']} empleos encontrados")
                        print(f"📊 Base de datos: {result['db_saved_count']} empleos guardados")
                        await codelco_progress.set_completed(result['jobs_count'])
                    else:
                        print("⚠️ No se encontraron empleos en el scraping simple")
                        await codelco_progress.set_error("No se encontraron empleos")
                        
                except Exception as fallback_error:
                    print(f"❌ Error en scraping simple también: {fallback_error}")
                    await codelco_progress.set_error(f"Error en ambos métodos: {str(fallback_error)}")
        
        # Ejecutar scraping en segundo plano
        background_tasks.add_task(scraping_task)
        
        return {
            "status": "started",
            "message": "Scraping iniciado en segundo plano con fallback simple",
            "note": "Los resultados se guardarán en la base de datos. Use /progress para monitorear"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error ejecutando scraping: {str(e)}")

@router.get("/codelco/scraping/status")
async def get_codelco_scraping_status(
    session: SessionDep,
    current_admin: dict = Depends(get_current_admin_user)
) -> JSONResponse:
    """
    Obtener el estado del scraping de Codelco - Mejorado con lógica del lado público
    """
    try:
        # Obtener estadísticas de empleos de Codelco
        result = await session.execute(
            select(CodelcoJob).where(CodelcoJob.activo == True)
        )
        active_jobs = result.scalars().all()
        
        # Obtener el último scraping
        latest_result = await session.execute(
            select(CodelcoJob)
            .where(CodelcoJob.activo == True)
            .order_by(CodelcoJob.fecha_scraped.desc())
            .limit(1)
        )
        latest_job = latest_result.scalar_one_or_none()
        
        # Información del scraper similar al endpoint público
        scraper_info = {
            "codelco": {
                "name": "Scraper de Codelco",
                "url": "https://empleos.codelco.cl/search/",
                "status": "active",
                "description": "Extrae ofertas laborales del sitio oficial de Codelco"
            }
        }
        
        return {
            "status": "success",
            "scraper_status": "ready",
            "active_jobs_count": len(active_jobs),
            "last_scraping": latest_job.fecha_scraped.isoformat() if latest_job else "Never",
            "system_health": "operational",
            "scrapers": scraper_info,
            "total_scrapers": len(scraper_info)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo estado: {str(e)}")

@router.get("/codelco/scraping/progress")
async def get_codelco_scraping_progress(
    current_admin: dict = Depends(get_current_admin_user)
) -> JSONResponse:
    """
    Obtener el progreso en tiempo real del scraping de Codelco
    """
    try:
        progress_data = await get_codelco_progress()
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "detail": "Progress retrieved successfully",
                "progress": progress_data
            }
        )
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while retrieving progress: {str(ex)}"
        )

@router.post("/codelco/scraping/reset")
async def reset_codelco_scraping_progress(
    current_admin: dict = Depends(get_current_admin_user)
) -> JSONResponse:
    """
    Resetear el progreso del scraping de Codelco
    """
    try:
        await reset_codelco_progress()
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "detail": "Progress reset successfully",
                "message": "El progreso del scraping ha sido reseteado"
            }
        )
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while resetting progress: {str(ex)}"
        )

@router.get("/codelco/jobs")
async def get_codelco_jobs_admin(
    session: SessionDep,
    current_admin: dict = Depends(get_current_admin_user),
    limit: int = 50
) -> JSONResponse:
    """
    Obtener empleos de Codelco (vista de administrador) - Mejorado con la lógica del lado público
    """
    try:
        # Obtener empleos activos de Codelco, ordenados por fecha de scraping más reciente
        result = await session.execute(
            select(CodelcoJob)
            .where(CodelcoJob.activo == True)
            .order_by(CodelcoJob.fecha_scraped.desc())
            .limit(limit)
        )
        jobs = result.scalars().all()
        
        # Convertir al formato esperado por el frontend (mismo formato que el lado público)
        formatted_jobs = []
        for job in jobs:
            formatted_jobs.append({
                "id": job.id or 0,  # ID numérico de la tabla
                "title": job.titulo,
                "location": job.ubicacion,
                "external_id": job.id_proceso,  # ID del proceso de Codelco como string
                "url": job.url,  # ← Cambiado de external_url a url para consistencia
                "region": job.region,
                "postal_code": job.codigo_postal,
                "publication_date": job.fecha,  # Fecha de cierre como string
                "scraped_at": job.fecha_scraped.isoformat() if job.fecha_scraped else "",  # ← Cambiado de created_at a scraped_at
                "is_active": job.activo,
                "description": job.descripcion or "",
                "requirements": job.requisitos or ""
            })
        
        return {
            "status": "success",
            "count": len(formatted_jobs),
            "jobs": formatted_jobs,
            "message": f"Se encontraron {len(formatted_jobs)} empleos de Codelco en la base de datos"
        }
        
    except Exception as e:
        print(f"Error al obtener empleos desde DB: {e}")
        raise HTTPException(status_code=500, detail=f"Error obteniendo empleos: {str(e)}")

@router.delete("/codelco/jobs")
async def deactivate_codelco_jobs(
    session: SessionDep,
    current_admin: dict = Depends(get_current_admin_user)
) -> JSONResponse:
    """
    Desactivar todos los empleos de Codelco - Mejorado con la lógica del lado público
    """
    try:
        result = await session.execute(
            select(CodelcoJob).where(CodelcoJob.activo == True)
        )
        jobs = result.scalars().all()
        
        count = len(jobs)
        
        for job in jobs:
            job.activo = False  # Marcar como inactivo en lugar de eliminar
            session.add(job)
        
        await session.commit()
        
        return {
            "status": "success",
            "message": f"Se desactivaron {count} empleos de Codelco",
            "deleted_count": count
        }
        
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail=f"Error eliminando empleos: {str(e)}")

@router.get("/external-jobs")
async def get_external_jobs(
    session: SessionDep,
    current_admin: dict = Depends(get_current_admin_user),
    limit: int = Query(default=50, ge=1, le=200),
    source: str = Query(default="all", description="Filtrar por fuente: 'all', 'codelco', 'internal'")
) -> JSONResponse:
    """
    Obtener todos los empleos externos (scrapeados) junto con empleos internos para comparación
    """
    try:
        external_jobs = []
        
        # Obtener empleos de Codelco si se solicita
        if source in ["all", "codelco"]:
            codelco_result = await session.execute(
                select(CodelcoJob)
                .where(CodelcoJob.activo == True)
                .order_by(CodelcoJob.fecha_scraped.desc())
                .limit(limit if source == "codelco" else limit // 2)
            )
            codelco_jobs = codelco_result.scalars().all()
            
            for job in codelco_jobs:
                external_jobs.append({
                    "id": f"codelco_{job.id}",
                    "internal_id": job.id,
                    "external_id": job.id_proceso,
                    "title": job.titulo,
                    "location": job.ubicacion,
                    "region": job.region,
                    "description": job.descripcion or "Descripción no disponible",
                    "requirements": job.requisitos or "Requisitos no especificados",
                    "publication_date": job.fecha,
                    "created_at": job.fecha_scraped.isoformat(),
                    "updated_at": job.fecha_actualizado.isoformat(),
                    "external_url": job.url,
                    "source": "Codelco",
                    "source_type": "external",
                    "is_active": job.activo,
                    "can_apply_external": True,
                    "company_name": "Codelco",
                    "scraping_info": {
                        "scraped_at": job.fecha_scraped.isoformat(),
                        "original_source": "https://empleos.codelco.cl/"
                    }
                })
        
        # Obtener empleos internos si se solicita (para comparación)
        if source in ["all", "internal"]:
            internal_result = await session.execute(
                select(JobOffer, Company.name.label("company_name"))
                .join(Company, JobOffer.company_id == Company.company_id)
                .where(JobOffer.state == "active")
                .order_by(JobOffer.publication_date.desc())
                .limit(limit if source == "internal" else limit // 2)
            )
            internal_jobs = internal_result.all()
            
            for job, company_name in internal_jobs:
                external_jobs.append({
                    "id": f"internal_{job.offer_id}",
                    "internal_id": job.offer_id,
                    "external_id": None,
                    "title": job.title,
                    "location": job.location or "No especificada",
                    "region": "Chile",  # Por defecto
                    "description": job.description or "Descripción no disponible",
                    "requirements": job.requirements or "Requisitos no especificados",
                    "publication_date": job.publication_date.isoformat() if job.publication_date else None,
                    "created_at": job.publication_date.isoformat() if job.publication_date else None,
                    "updated_at": job.publication_date.isoformat() if job.publication_date else None,
                    "external_url": None,
                    "source": company_name or "Portal Interno",
                    "source_type": "internal",
                    "is_active": job.state == "active",
                    "can_apply_external": False,
                    "company_name": company_name,
                    "scraping_info": None
                })
        
        # Ordenar por fecha de creación (más recientes primero)
        external_jobs.sort(key=lambda x: x["created_at"] or "", reverse=True)
        
        # Estadísticas
        codelco_count = len([j for j in external_jobs if j["source_type"] == "external"])
        internal_count = len([j for j in external_jobs if j["source_type"] == "internal"])
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "detail": "External jobs retrieved successfully",
                "total_count": len(external_jobs),
                "codelco_count": codelco_count,
                "internal_count": internal_count,
                "source_filter": source,
                "jobs": external_jobs,
                "sources_available": {
                    "codelco": {
                        "name": "Codelco",
                        "description": "Empleos scrapeados del sitio oficial de Codelco",
                        "count": codelco_count,
                        "can_apply_external": True
                    },
                    "internal": {
                        "name": "Portal Interno", 
                        "description": "Empleos creados directamente en el portal",
                        "count": internal_count,
                        "can_apply_external": False
                    }
                }
            }
        )
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while retrieving external jobs: {str(ex)}"
        )
