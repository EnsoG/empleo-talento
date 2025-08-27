"""
Modelo para el seguimiento de progreso de scraping en tiempo real
"""
from enum import Enum
from typing import Optional, Dict, Any, Callable
from datetime import datetime
import asyncio
import json


class ScrapingStatus(str, Enum):
    """Estados del proceso de scraping"""
    IDLE = "idle"
    STARTING = "starting"
    FETCHING_PAGES = "fetching_pages"
    EXTRACTING_JOBS = "extracting_jobs"
    SAVING_TO_DB = "saving_to_db"
    COMPLETED = "completed"
    ERROR = "error"


class ScrapingProgress:
    """
    Sistema de seguimiento de progreso para operaciones de scraping
    Mantiene estado en memoria y permite callbacks para actualizaciones en tiempo real
    """
    
    def __init__(self):
        self.status: ScrapingStatus = ScrapingStatus.IDLE
        self.progress_percentage: float = 0.0
        self.current_step: str = ""
        self.total_jobs_found: int = 0
        self.jobs_processed: int = 0
        self.jobs_saved: int = 0
        self.start_time: Optional[datetime] = None
        self.end_time: Optional[datetime] = None
        self.error_message: Optional[str] = None
        self.callbacks: list[Callable] = []
        self._lock = asyncio.Lock()
    
    async def update_status(self, status: ScrapingStatus, step: str = "", progress: float = None):
        """Actualizar el estado del scraping"""
        async with self._lock:
            self.status = status
            self.current_step = step
            
            if progress is not None:
                self.progress_percentage = min(100.0, max(0.0, progress))
            
            # Auto-calcular progreso basado en el estado
            if status == ScrapingStatus.STARTING:
                self.progress_percentage = 5.0
                self.start_time = datetime.utcnow()
            elif status == ScrapingStatus.FETCHING_PAGES:
                self.progress_percentage = 20.0
            elif status == ScrapingStatus.EXTRACTING_JOBS:
                self.progress_percentage = 50.0
            elif status == ScrapingStatus.SAVING_TO_DB:
                self.progress_percentage = 80.0
            elif status == ScrapingStatus.COMPLETED:
                self.progress_percentage = 100.0
                self.end_time = datetime.utcnow()
            elif status == ScrapingStatus.ERROR:
                self.end_time = datetime.utcnow()
            
            # Notificar a los callbacks
            await self._notify_callbacks()
    
    async def update_jobs_count(self, total: int = None, processed: int = None, saved: int = None):
        """Actualizar contadores de empleos"""
        async with self._lock:
            if total is not None:
                self.total_jobs_found = total
            if processed is not None:
                self.jobs_processed = processed
            if saved is not None:
                self.jobs_saved = saved
            
            # Calcular progreso basado en empleos procesados
            if self.total_jobs_found > 0:
                job_progress = (self.jobs_processed / self.total_jobs_found) * 30  # 30% del progreso total
                if self.status == ScrapingStatus.EXTRACTING_JOBS:
                    self.progress_percentage = 50.0 + job_progress
                elif self.status == ScrapingStatus.SAVING_TO_DB:
                    save_progress = (self.jobs_saved / self.total_jobs_found) * 20  # 20% del progreso total
                    self.progress_percentage = 80.0 + save_progress
            
            await self._notify_callbacks()
    
    async def set_error(self, error_message: str):
        """Marcar el scraping como error"""
        async with self._lock:
            self.status = ScrapingStatus.ERROR
            self.error_message = error_message
            self.end_time = datetime.utcnow()
            await self._notify_callbacks()
    
    async def reset(self):
        """Resetear el progreso para un nuevo scraping"""
        async with self._lock:
            self.status = ScrapingStatus.IDLE
            self.progress_percentage = 0.0
            self.current_step = ""
            self.total_jobs_found = 0
            self.jobs_processed = 0
            self.jobs_saved = 0
            self.start_time = None
            self.end_time = None
            self.error_message = None
            await self._notify_callbacks()
    
    def add_callback(self, callback: Callable):
        """Agregar callback para notificaciones de progreso"""
        self.callbacks.append(callback)
    
    def remove_callback(self, callback: Callable):
        """Remover callback"""
        if callback in self.callbacks:
            self.callbacks.remove(callback)
    
    async def _notify_callbacks(self):
        """Notificar a todos los callbacks registrados"""
        for callback in self.callbacks:
            try:
                if asyncio.iscoroutinefunction(callback):
                    await callback(self.to_dict())
                else:
                    callback(self.to_dict())
            except Exception as e:
                print(f"Error in progress callback: {e}")
    
    def to_dict(self) -> Dict[str, Any]:
        """Convertir el progreso a diccionario para serialización"""
        duration = None
        if self.start_time:
            end = self.end_time or datetime.utcnow()
            duration = (end - self.start_time).total_seconds()
        
        return {
            "status": self.status.value,
            "progress_percentage": round(self.progress_percentage, 1),
            "current_step": self.current_step,
            "total_jobs_found": self.total_jobs_found,
            "jobs_processed": self.jobs_processed,
            "jobs_saved": self.jobs_saved,
            "start_time": self.start_time.isoformat() if self.start_time else None,
            "end_time": self.end_time.isoformat() if self.end_time else None,
            "duration_seconds": round(duration, 1) if duration else None,
            "error_message": self.error_message,
            "is_running": self.status not in [ScrapingStatus.IDLE, ScrapingStatus.COMPLETED, ScrapingStatus.ERROR],
            "is_completed": self.status == ScrapingStatus.COMPLETED,
            "has_error": self.status == ScrapingStatus.ERROR
        }


# Instancia global para el progreso de Codelco
codelco_progress = ScrapingProgress()


async def get_codelco_progress() -> Dict[str, Any]:
    """Obtener el progreso actual del scraping de Codelco"""
    return codelco_progress.to_dict()


async def reset_codelco_progress():
    """Resetear el progreso del scraping de Codelco"""
    await codelco_progress.reset()
