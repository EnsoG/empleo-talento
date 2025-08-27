"""
Utilidad para manejar el estado del scraping en tiempo real
"""

from typing import Dict, Optional, Any
from datetime import datetime
from enum import Enum

class ScrapingStatus(Enum):
    """Estados posibles del scraping"""
    IDLE = "idle"
    RUNNING = "running"
    COMPLETED = "completed"
    ERROR = "error"

class ScrapingProgress:
    """Clase para manejar el progreso del scraping"""
    
    def __init__(self):
        self._status: ScrapingStatus = ScrapingStatus.IDLE
        self._progress: int = 0
        self._max_progress: int = 100
        self._message: str = ""
        self._current_job: str = ""
        self._jobs_found: int = 0
        self._jobs_saved: int = 0
        self._error: Optional[str] = None
        self._start_time: Optional[datetime] = None
        self._end_time: Optional[datetime] = None
        self._result: Optional[Dict[str, Any]] = None

    def start_scraping(self, max_jobs: int = 100):
        """Inicia el proceso de scraping"""
        self._status = ScrapingStatus.RUNNING
        self._progress = 0
        self._max_progress = max_jobs
        self._message = "Iniciando scraping de Codelco..."
        self._current_job = ""
        self._jobs_found = 0
        self._jobs_saved = 0
        self._error = None
        self._start_time = datetime.now()
        self._end_time = None
        self._result = None

    def update_progress(self, current: int, message: str = "", current_job: str = ""):
        """Actualiza el progreso del scraping"""
        if self._status != ScrapingStatus.RUNNING:
            return
        
        self._progress = current
        if message:
            self._message = message
        if current_job:
            self._current_job = current_job

    def set_jobs_found(self, count: int):
        """Establece el número de empleos encontrados"""
        self._jobs_found = count

    def set_jobs_saved(self, count: int):
        """Establece el número de empleos guardados"""
        self._jobs_saved = count

    def complete_scraping(self, result: Dict[str, Any]):
        """Completa el proceso de scraping"""
        self._status = ScrapingStatus.COMPLETED
        self._progress = self._max_progress
        self._message = f"Scraping completado: {result.get('jobs_count', 0)} empleos encontrados"
        self._end_time = datetime.now()
        self._result = result
        self._jobs_found = result.get('jobs_count', 0)
        self._jobs_saved = result.get('db_saved_count', 0)

    def set_error(self, error_message: str):
        """Establece un error en el scraping"""
        self._status = ScrapingStatus.ERROR
        self._error = error_message
        self._message = f"Error en scraping: {error_message}"
        self._end_time = datetime.now()

    def reset(self):
        """Resetea el estado del scraping"""
        self._status = ScrapingStatus.IDLE
        self._progress = 0
        self._message = ""
        self._current_job = ""
        self._jobs_found = 0
        self._jobs_saved = 0
        self._error = None
        self._start_time = None
        self._end_time = None
        self._result = None

    def get_status(self) -> Dict[str, Any]:
        """Obtiene el estado actual del scraping"""
        duration = None
        if self._start_time:
            end_time = self._end_time or datetime.now()
            duration = (end_time - self._start_time).total_seconds()

        return {
            "status": self._status.value,
            "progress": self._progress,
            "max_progress": self._max_progress,
            "progress_percentage": round((self._progress / self._max_progress) * 100, 1) if self._max_progress > 0 else 0,
            "message": self._message,
            "current_job": self._current_job,
            "jobs_found": self._jobs_found,
            "jobs_saved": self._jobs_saved,
            "error": self._error,
            "start_time": self._start_time.isoformat() if self._start_time else None,
            "end_time": self._end_time.isoformat() if self._end_time else None,
            "duration_seconds": duration,
            "is_running": self._status == ScrapingStatus.RUNNING,
            "is_completed": self._status == ScrapingStatus.COMPLETED,
            "is_error": self._status == ScrapingStatus.ERROR,
            "result": self._result
        }

# Instancia global para el estado del scraping
scraping_progress = ScrapingProgress()
