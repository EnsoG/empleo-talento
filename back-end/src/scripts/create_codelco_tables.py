"""
Script para crear las tablas de empleos de Codelco en la base de datos
"""

import asyncio
import sys
import os

# Agregar el directorio padre al path para que funcionen los imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlmodel import SQLModel
from config.db import engine
from models.codelco_job import CodelcoJob

async def create_codelco_tables():
    """Crear las tablas de empleos de Codelco"""
    print("🔧 Creando tablas de empleos de Codelco...")
    
    # Para engines asíncronos, necesitamos usar begin()
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    
    print("✅ Tablas de empleos de Codelco creadas exitosamente!")
    print("📋 Tabla creada: codelco_jobs")

if __name__ == "__main__":
    asyncio.run(create_codelco_tables())
