"""
Modelo para empleos scraped de Codelco
"""

from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional


class CodelcoJobBase(SQLModel):
    """Campos base para empleos de Codelco"""
    id_proceso: str = Field(index=True, description="ID del proceso en Codelco")
    titulo: str = Field(description="Título del empleo")
    url: str = Field(description="URL para aplicar en Codelco")
    fecha: str = Field(description="Fecha de cierre de postulaciones")
    region: str = Field(description="Región de Chile")
    codigo_postal: str = Field(description="Código postal")
    ubicacion: str = Field(description="Ubicación completa")
    descripcion: Optional[str] = Field(default=None, description="Descripción completa del empleo")
    requisitos: Optional[str] = Field(default=None, description="Requisitos específicos")
    activo: bool = Field(default=True, description="Si el empleo está activo")


class CodelcoJob(CodelcoJobBase, table=True):
    """Tabla de empleos de Codelco en la base de datos"""
    __tablename__ = "codelco_jobs"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    fecha_scraped: datetime = Field(default_factory=datetime.now, description="Fecha de scraping")
    fecha_creado: datetime = Field(default_factory=datetime.now, description="Fecha de creación en DB")
    fecha_actualizado: datetime = Field(default_factory=datetime.now, description="Fecha de última actualización")


class CodelcoJobCreate(CodelcoJobBase):
    """Schema para crear empleos de Codelco"""
    pass


class CodelcoJobRead(CodelcoJobBase):
    """Schema para leer empleos de Codelco"""
    id: int
    fecha_scraped: datetime
    fecha_creado: datetime
    fecha_actualizado: datetime


class CodelcoJobUpdate(SQLModel):
    """Schema para actualizar empleos de Codelco"""
    titulo: Optional[str] = None
    url: Optional[str] = None
    fecha: Optional[str] = None
    region: Optional[str] = None
    codigo_postal: Optional[str] = None
    ubicacion: Optional[str] = None
    descripcion: Optional[str] = None
    requisitos: Optional[str] = None
    activo: Optional[bool] = None
