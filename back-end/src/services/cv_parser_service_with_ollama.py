import os
from typing import Dict
from .ollama_cv_parser import OllamaCVParser
from .cv_parser_service import CVParserService as TraditionalParser
from config.settings import get_settings
class CVParserService:
    def __init__(self):
        #llamar desde settings.py
        self.ollama_timeout = get_settings().ollama_timeout
        self.ollama_url = get_settings().ollama_url
        self.ollama_model = get_settings().ollama_model
        
        if self.use_ollama:
            self.parser = OllamaCVParser(self.ollama_url, self.ollama_model)
            print(f"Usando Ollama parser con modelo: {self.ollama_model}")
        else:
            self.parser = TraditionalParser()
            print("Usando parser tradicional")
    
    async def parse_resume(self, file_path: str) -> Dict:
        """
        Parsea el CV usando el parser configurado
        """
        return await self.parser.parse_resume(file_path)

