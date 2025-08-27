"""
Router para manejo de scrapers
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import Dict, List
import asyncio
import sys
import os

# Agregar al path para imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scrapers.codelco_scraper import CodelcoScraper
from config.db import SessionDep
from models.codelco_job import CodelcoJob, CodelcoJobRead
from sqlmodel import select
from datetime import datetime

router = APIRouter(prefix="/scrapers", tags=["scrapers"])


@router.get("/codelco/test")
async def test_codelco_scraper():
    """Prueba la conexión y funcionalidad básica del scraper de Codelco"""
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


@router.post("/codelco/execute")
async def execute_codelco_scraping_simple():
    """Endpoint que ejecuta el scraping y espera a que termine antes de responder"""
    try:
        scraper = CodelcoScraper()
        result = await scraper.scrape_and_save()
        
        if result["success"]:
            return {
                "status": "completed",
                "message": f"Búsqueda completada exitosamente. {result['jobs_count']} empleos encontrados.",
                "jobs_count": result['jobs_count'],
                "db_saved_count": result['db_saved_count']
            }
        else:
            return {
                "status": "completed",
                "message": "Búsqueda completada pero no se encontraron empleos nuevos.",
                "jobs_count": 0,
                "db_saved_count": 0
            }
            
    except Exception as e:
        print(f"Error en búsqueda: {e}")
        raise HTTPException(status_code=500, detail=f"Error durante la búsqueda: {str(e)}")


@router.post("/codelco/run")
async def run_codelco_scraper(background_tasks: BackgroundTasks):
    """Ejecuta el scraper completo de Codelco en segundo plano"""
    
    async def scrape_task():
        """Tarea de scraping en segundo plano"""
        try:
            scraper = CodelcoScraper()
            result = await scraper.scrape_and_save()
            
            if result["success"]:
                print(f"Scraping completado: {result['jobs_count']} empleos encontrados")
                print(f"Archivo JSON: {result['json_file']}")
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
        "note": "Los resultados se guardarán en un archivo JSON en el directorio del backend"
    }


@router.get("/codelco/jobs")
async def get_scraped_jobs(session: SessionDep, limit: int = 50):
    """Obtiene los empleos de Codelco desde la base de datos"""
    try:
        # Obtener empleos activos de Codelco, ordenados por fecha de scraping más reciente
        result = await session.execute(
            select(CodelcoJob)
            .where(CodelcoJob.activo == True)
            .order_by(CodelcoJob.fecha_scraped.desc())
            .limit(limit)
        )
        jobs = result.scalars().all()
        
        # Convertir al formato esperado por el frontend
        formatted_jobs = []
        for job in jobs:
            formatted_jobs.append({
                "id": job.id or 0,  # ID numérico de la tabla
                "title": job.titulo,
                "location": job.ubicacion,
                "external_id": job.id_proceso,  # ID del proceso de Codelco como string
                "url": job.url,  # URL directa para enlaces
                "region": job.region,
                "postal_code": job.codigo_postal,
                "publication_date": job.fecha,  # Fecha de cierre como string
                "scraped_at": job.fecha_scraped.isoformat() if job.fecha_scraped else "",
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


@router.get("/status")
async def get_scrapers_status():
    """Obtiene el estado general de los scrapers"""
    try:
        # Aquí podrías agregar más scrapers en el futuro
        scrapers_info = {
            "codelco": {
                "name": "Scraper de Codelco",
                "url": "https://empleos.codelco.cl/search/",
                "status": "active",
                "description": "Extrae ofertas laborales del sitio oficial de Codelco"
            }
        }
        
        return {
            "status": "success",
            "scrapers": scrapers_info,
            "total_scrapers": len(scrapers_info)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo estado: {str(e)}")


@router.delete("/codelco/jobs")
async def delete_codelco_jobs(session: SessionDep):
    """Elimina todos los empleos de Codelco de la base de datos"""
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
