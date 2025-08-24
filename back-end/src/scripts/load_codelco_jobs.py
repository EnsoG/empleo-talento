"""
Script para cargar empleos de Codelco desde archivo JSON a la base de datos
"""

import asyncio
import json
import sys
import os
from datetime import datetime

# Agregar el directorio padre al path para que funcionen los imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.codelco_job import CodelcoJob
from config.settings import get_settings
from sqlmodel import select, Session, create_engine

def load_jobs_from_json():
    """Cargar empleos desde el archivo JSON más reciente"""
    
    # Crear engine síncrono para este script
    settings = get_settings()
    database_url = f"mysql+pymysql://{settings.db_username}:{settings.db_password}@{settings.db_host}/{settings.db_name}"
    sync_engine = create_engine(database_url, echo=False)
    
    # Buscar archivo JSON más reciente
    import glob
    json_files = glob.glob("empleos_codelco_*.json")
    if not json_files:
        print("❌ No se encontraron archivos JSON de empleos de Codelco")
        return
    
    latest_file = max(json_files, key=os.path.getctime)
    print(f"📁 Cargando empleos desde: {latest_file}")
    
    # Leer datos del archivo
    with open(latest_file, 'r', encoding='utf-8') as f:
        jobs_data = json.load(f)
    
    print(f"📋 Encontrados {len(jobs_data)} empleos en el archivo")
    
    # Guardar en base de datos
    saved_count = 0
    updated_count = 0
    
    with Session(sync_engine) as session:
        for job_data in jobs_data:
            try:
                # Verificar si el empleo ya existe
                existing_job = session.exec(
                    select(CodelcoJob).where(CodelcoJob.id_proceso == job_data["id_proceso"])
                ).first()
                
                if existing_job:
                    # Actualizar empleo existente
                    existing_job.titulo = job_data["titulo"]
                    existing_job.url = job_data["url"]
                    existing_job.fecha = job_data["fecha"]
                    existing_job.region = job_data["region"]
                    existing_job.codigo_postal = job_data["codigo_postal"]
                    existing_job.ubicacion = job_data["ubicacion"]
                    existing_job.descripcion = job_data.get("descripcion")
                    existing_job.requisitos = job_data.get("requisitos")
                    existing_job.fecha_actualizado = datetime.now()
                    existing_job.activo = True
                    
                    session.add(existing_job)
                    updated_count += 1
                    print(f"   🔄 Actualizado: {job_data['titulo'][:50]}...")
                else:
                    # Crear nuevo empleo
                    fecha_scraped = job_data.get("fecha_scraped", datetime.now().isoformat())
                    if isinstance(fecha_scraped, str):
                        try:
                            if 'Z' in fecha_scraped:
                                fecha_scraped = datetime.fromisoformat(fecha_scraped.replace('Z', '+00:00'))
                            else:
                                fecha_scraped = datetime.fromisoformat(fecha_scraped)
                        except:
                            fecha_scraped = datetime.now()
                    
                    db_job = CodelcoJob(
                        id_proceso=job_data["id_proceso"],
                        titulo=job_data["titulo"],
                        url=job_data["url"],
                        fecha=job_data["fecha"],
                        region=job_data["region"],
                        codigo_postal=job_data["codigo_postal"],
                        ubicacion=job_data["ubicacion"],
                        descripcion=job_data.get("descripcion"),
                        requisitos=job_data.get("requisitos"),
                        fecha_scraped=fecha_scraped,
                        activo=True
                    )
                    
                    session.add(db_job)
                    saved_count += 1
                    print(f"   ✅ Creado: {job_data['titulo'][:50]}...")
                
            except Exception as e:
                print(f"   ❌ Error procesando {job_data.get('titulo', 'Unknown')}: {e}")
                continue
        
        session.commit()
    
    print(f"\n🎉 Proceso completado!")
    print(f"✅ {saved_count} empleos nuevos creados")
    print(f"🔄 {updated_count} empleos actualizados")
    print(f"📊 Total procesados: {saved_count + updated_count}")

if __name__ == "__main__":
    load_jobs_from_json()
