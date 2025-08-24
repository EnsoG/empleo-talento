"""
Script para integrar el scraper de Codelco con la base de datos del proyecto
"""

import asyncio
import sys
import os
from datetime import datetime
from typing import List, Dict

# Agregar el directorio padre al path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scrapers.codelco_scraper import CodelcoScraper
from config.db import SessionDep, async_session
from models.job_offer import JobOffer
from sqlmodel import select


async def save_jobs_to_database(jobs: List[Dict]) -> int:
    """Guarda los empleos en la base de datos"""
    saved_count = 0
    
    async with async_session() as session:
        try:
            for job_data in jobs:
                # Verificar si el empleo ya existe
                result = await session.execute(
                    select(JobOffer).where(JobOffer.external_id == job_data['id_proceso'])
                )
                existing_job = result.first()
                
                if not existing_job:
                    # Crear nuevo empleo
                    new_job = JobOffer(
                        title=job_data['titulo'],
                        description=job_data.get('descripcion', ''),
                        requirements=job_data.get('requisitos', ''),
                        location=job_data['ubicacion'],
                        external_url=job_data['url'],
                        external_id=job_data['id_proceso'],
                        source='codelco',
                        region=job_data['region'],
                        postal_code=job_data['codigo_postal'],
                        publication_date=job_data['fecha'],
                        created_at=datetime.now(),
                        is_active=True
                    )
                    
                    session.add(new_job)
                    saved_count += 1
                    print(f"   ✅ Guardado: {job_data['titulo']}")
                else:
                    print(f"   ⚠️  Ya existe: {job_data['titulo']}")
            
            await session.commit()
            print(f"✅ Total de empleos guardados en la base de datos: {saved_count}")
            
        except Exception as e:
            await session.rollback()
            print(f"❌ Error guardando en la base de datos: {e}")
            raise
    
    return saved_count


async def scrape_and_save_codelco_jobs():
    """Función principal que ejecuta el scraping y guarda en la base de datos"""
    print("🏭 SCRAPER DE CODELCO - INTEGRACIÓN CON BASE DE DATOS")
    print("=" * 60)
    
    # Ejecutar scraper
    scraper = CodelcoScraper()
    
    try:
        print("🚀 Iniciando scraping de empleos...")
        jobs = await scraper.scrape_all_jobs()
        
        if jobs:
            print(f"\n📊 RESULTADOS DEL SCRAPING:")
            print(f"Total de empleos extraídos: {len(jobs)}")
            
            # Guardar en archivo JSON como respaldo
            filename = scraper.save_to_json(jobs)
            print(f"📁 Respaldo guardado en: {filename}")
            
            # Convertir a formato para base de datos
            jobs_data = []
            for job in jobs:
                jobs_data.append({
                    'id_proceso': job.id_proceso,
                    'titulo': job.titulo,
                    'url': job.url,
                    'fecha': job.fecha,
                    'region': job.region,
                    'codigo_postal': job.codigo_postal,
                    'ubicacion': job.ubicacion,
                    'descripcion': job.descripcion,
                    'requisitos': job.requisitos
                })
            
            # Guardar en base de datos
            print(f"\n💾 GUARDANDO EN BASE DE DATOS:")
            saved_count = await save_jobs_to_database(jobs_data)
            
            print(f"\n🎉 ¡PROCESO COMPLETADO!")
            print(f"📋 Empleos extraídos: {len(jobs)}")
            print(f"💾 Empleos guardados en BD: {saved_count}")
            print(f"📁 Archivo de respaldo: {filename}")
            
        else:
            print("❌ No se encontraron empleos para procesar")
            
    except Exception as e:
        print(f"❌ Error durante el proceso: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(scrape_and_save_codelco_jobs())
