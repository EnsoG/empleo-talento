import re
import os
import json
import aiohttp
from typing import Dict, List, Optional, Tuple
from datetime import date, datetime
import pdfplumber
from docx import Document
from config.settings import get_settings
class OllamaCVParser:
    
    def __init__(self, ollama_url: str = None, model: str = None):
        self.ollama_url = get_settings().ollama_url
        self.model = get_settings().ollama_model# Puedes usar: llama2, mistral, mixtral, etc.
        self.temp_dir = "src/temp/resumes"
        os.makedirs(self.temp_dir, exist_ok=True)
        
    async def parse_resume(self, file_path: str) -> Dict:
        """
        Parsea el CV usando Ollama para extracción inteligente
        """
        try:
            # Extraer texto del archivo
            text = self._extract_text(file_path)
            if not text:
                print("No se pudo extraer texto del archivo")
                return self._get_empty_structure()
            
            # Usar Ollama para extraer información estructurada
            extracted_data = await self._extract_with_ollama(text)
            
            # Validar y formatear los datos
            formatted_data = self._validate_and_format(extracted_data)
            
            print(f"Parsing con Ollama exitoso")
            return formatted_data
            
        except Exception as e:
            print(f"Error parsing CV con Ollama: {str(e)}")
            # Fallback al parser tradicional
            return await self._fallback_parse(file_path)
    
    async def _extract_with_ollama(self, cv_text: str) -> Dict:
        """
        Usa Ollama para extraer información estructurada del CV
        """
        # Prompt optimizado para extracción de CVs en español
        prompt = f"""Analiza el siguiente CV y extrae la información en formato JSON. 
Sé muy preciso con las fechas y no inventes información que no esté en el texto.

IMPORTANTE:
- Para fechas usa formato ISO (YYYY-MM-DD)
- Si no hay fecha de fin, usa null
- Si solo hay año, usa YYYY-01-01
- No inventes información, si algo no está claro, usa "No especificado"
- No incluyas idioma o lenguaje si no está explícito, o no estás seguro de su nivel
- No incluyas información que no esté explícita en el CV
- Skills si están explicitas deben ser software, herramientas tecnológicas o aplicaciones, no habilidades blandas

IMPORTANTE PARA EXPERIENCIA:
- Incluir empresa específica en cada trabajo
- No duplicar si es mismo cargo en diferente empresa



CV:
{cv_text[:3000]}  # Limitamos para no exceder contexto

Extrae la siguiente información en este formato JSON exacto:
{{
    "personal_info": {{
        "full_name": "nombre completo",
        "email": "email",
        "phone": "teléfono",
        "location": "ubicación"
    }},
    "work_experience": [
        {{
            "position": "cargo",
            "company": "empresa",
            "start_date": "YYYY-MM-DD",
            "end_date": "YYYY-MM-DD o null si es presente",
            "description": "descripción de responsabilidades"
        }}
    ],
    "education": [
        {{
            "degree": "título obtenido",
            "field": "área de estudio",
            "institution": "institución",
            "start_date": "YYYY-MM-DD",
            "end_date": "YYYY-MM-DD o null"
        }}
    ],
    "skills": ["skill1", "skill2"],
    "languages": [
        {{
            "language": "idioma",
            "level": "nivel (Básico/Intermedio/Avanzado/Nativo)"
        }}
    ]
}}

# Responde SOLO con el JSON, sin explicaciones adicionales."""
#         prompt = """Eres un extractor de información de CVs. Tu tarea es analizar el CV y extraer información en formato JSON válido.

# REGLAS ESTRICTAS:
# 1. Responde ÚNICAMENTE con JSON válido, sin texto adicional
# 2. Si una información no existe, usa exactamente: "No especificado"
# 3. Para fechas: formato ISO (YYYY-MM-DD). Si solo hay año: YYYY-01-01
# 4. Para fechas de fin actuales: usar null (sin comillas)
# 5. NO inventes ni asumas información que no esté explícita

# CV A ANALIZAR:
# {cv_text[:3000]}

# FORMATO DE SALIDA REQUERIDO:
# json
# {
# "personal_info": {
# "full_name": "string o 'No especificado'",
# "email": "string o 'No especificado'",
# "phone": "string o 'No especificado'",
# "location": "string o 'No especificado'"
# },
# "work_experience": [
# {
# "position": "string o 'No especificado'",
# "company": "string o 'No especificado'",
# "start_date": "YYYY-MM-DD o 'No especificado'",
# "end_date": "YYYY-MM-DD o null o 'No especificado'",
# "description": "string o 'No especificado'"
# }
# ],
# "education": [
# {
# "degree": "string o 'No especificado'",
# "field": "string o 'No especificado'",
# "institution": "string o 'No especificado'",
# "start_date": "YYYY-MM-DD o 'No especificado'",
# "end_date": "YYYY-MM-DD o null o 'No especificado'"
# }
# ],
# "skills": ["skill1", "skill2"],
# "languages": [
# {
# "language": "string o 'No especificado'",
# "level": "Básico|Intermedio|Avanzado|Nativo o 'No especificado'"
# }
# ]
# }


# IMPORTANTE PARA SKILLS:
# - Solo extraer software, herramientas tecnológicas o aplicaciones
# - Ejemplos: Excel, Python, AutoCAD, Photoshop, SAP, etc.
# - NO incluir habilidades blandas como "liderazgo", "trabajo en equipo"
# - Niveles permitidos: "Basico", "Intermedio", "Avanzado"

# Responde SOLO con el JSON, sin explicaciones adicionales."""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.ollama_url}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": prompt,
                        "stream": False,
                        "format": "json"  # Forzar respuesta en JSON
                    }
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        response_text = result.get('response', '{}')
                        
                        # Intentar parsear el JSON
                        try:
                            extracted_data = json.loads(response_text)
                            return extracted_data
                        except json.JSONDecodeError:
                            # Si falla, intentar limpiar y parsear
                            cleaned = self._clean_json_response(response_text)
                            return json.loads(cleaned)
                    else:
                        print(f"Error en Ollama API: {response.status}")
                        return {}
                        
        except Exception as e:
            print(f"Error llamando a Ollama: {str(e)}")
            return {}
    
    def _clean_json_response(self, text: str) -> str:
        """
        Limpia la respuesta para extraer solo el JSON
        """
        # Buscar el JSON en la respuesta
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if json_match:
            return json_match.group(0)
        return "{}"
    
    def _validate_and_format(self, ollama_data: Dict) -> Dict:
        """
        Valida y formatea los datos extraídos por Ollama
        """
        # Estructura base
        formatted = self._get_empty_structure()
        
        try:
            # Procesar información personal
            if 'personal_info' in ollama_data:
                personal = ollama_data['personal_info']
                formatted['personal_info'] = {
                    'name': self._parse_full_name(personal.get('full_name', '')),
                    'email': personal.get('email', ''),
                    'phone': self._format_phone(personal.get('phone', ''))
                }
            
            # Procesar experiencia laboral
            if 'work_experience' in ollama_data:
                formatted['work_experience'] = []
                for exp in ollama_data['work_experience']:
                    if isinstance(exp, dict):
                        formatted['work_experience'].append({
                            'position': exp.get('position', 'No especificado')[:150],
                            'company': exp.get('company', 'No especificada')[:150],
                            'description': exp.get('description', ''),
                            'start_date': self._parse_date(exp.get('start_date')),
                            'end_date': self._parse_date(exp.get('end_date'))
                        })
            
            # Procesar educación
            if 'education' in ollama_data:
                formatted['education'] = []
                for edu in ollama_data['education']:
                    if isinstance(edu, dict):
                        title = f"{edu.get('degree', '')} {edu.get('field', '')}".strip()
                        formatted['education'].append({
                            'title': title[:200] if title else 'No especificado',
                            'institution': edu.get('institution', 'No especificada')[:200],
                            'start_date': self._parse_date(edu.get('start_date')),
                            'end_date': self._parse_date(edu.get('end_date'))
                        })
            
            # Procesar habilidades
            if 'skills' in ollama_data and isinstance(ollama_data['skills'], list):
                formatted['software_skills'] = [
                    {'software': skill[:100], 'level': 'Intermedio'} 
                    for skill in ollama_data['skills'] 
                    if isinstance(skill, str)
                ]
            
            # Procesar idiomas
            if 'languages' in ollama_data:
                formatted['languages'] = []
                for lang in ollama_data['languages']:
                    if isinstance(lang, dict):
                        formatted['languages'].append({
                            'language': lang.get('language', 'No especificado'),
                            'level': self._normalize_language_level(lang.get('level', 'Intermedio'))
                        })
            
        except Exception as e:
            print(f"Error validando datos de Ollama: {str(e)}")
        
        return formatted
    
    def _parse_date(self, date_str: Optional[str]) -> Optional[date]:
        """
        Parsea una fecha string a objeto date
        """
        if not date_str or date_str == 'null':
            return None
        
        try:
            # Intentar varios formatos
            for fmt in ['%Y-%m-%d', '%Y/%m/%d', '%d-%m-%Y', '%d/%m/%Y', '%Y']:
                try:
                    return datetime.strptime(date_str, fmt).date()
                except ValueError:
                    continue
            
            # Si solo es un año
            if len(date_str) == 4 and date_str.isdigit():
                return date(int(date_str), 1, 1)
                
        except Exception:
            pass
        
        # Fecha por defecto si falla todo
        return date(2020, 1, 1)
    
    def _normalize_language_level(self, level: str) -> str:
        """
        Normaliza los niveles de idioma
        """
        level_lower = level.lower()
        
        if any(word in level_lower for word in ['básico', 'basic', 'a1', 'a2']):
            return 'Básico'
        elif any(word in level_lower for word in ['intermedio', 'intermediate', 'b1', 'b2']):
            return 'Intermedio'
        elif any(word in level_lower for word in ['avanzado', 'advanced', 'c1', 'c2']):
            return 'Avanzado'
        elif any(word in level_lower for word in ['nativo', 'native']):
            return 'Nativo'
        
        return 'Intermedio'
    
    async def _fallback_parse(self, file_path: str) -> Dict:
        """
        Parser tradicional como fallback si Ollama falla
        """
        from .cv_parser_service import CVParserService
        traditional_parser = CVParserService()
        return await traditional_parser.parse_resume(file_path)
    
    def _extract_text(self, file_path: str) -> str:
        """
        Extrae texto de PDF o DOCX
        """
        text = ""
        
        try:
            if file_path.lower().endswith('.pdf'):
                with pdfplumber.open(file_path) as pdf:
                    for page in pdf.pages:
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text + "\n"
            
            elif file_path.lower().endswith(('.docx', '.doc')):
                doc = Document(file_path)
                text = "\n".join([para.text for para in doc.paragraphs if para.text])
                
        except Exception as e:
            print(f"Error extracting text: {e}")
            
        return text
    
    def _get_empty_structure(self) -> Dict:
        """
        Retorna una estructura vacía pero válida
        """
        return {
            "personal_info": {
                "name": {"name": "", "paternal": "", "maternal": ""},
                "email": "",
                "phone": ""
            },
            "education": [],
            "work_experience": [],
            "languages": [],
            "software_skills": []
        }
    
    def _parse_full_name(self, full_name: str) -> Dict[str, str]:
        """
        Separa el nombre completo en partes
        """
        if not full_name:
            return {"name": "", "paternal": "", "maternal": ""}
        
        parts = full_name.strip().split()
        
        if len(parts) == 1:
            return {"name": parts[0], "paternal": "", "maternal": ""}
        elif len(parts) == 2:
            return {"name": parts[0], "paternal": parts[1], "maternal": ""}
        elif len(parts) == 3:
            return {"name": parts[0], "paternal": parts[1], "maternal": parts[2]}
        else:
            return {
                "name": " ".join(parts[:-2]),
                "paternal": parts[-2],
                "maternal": parts[-1]
            }
    
    def _format_phone(self, phone: str) -> str:
        """
        Formatea el número de teléfono
        """
        if not phone:
            return ""
        
        # Eliminar caracteres no numéricos
        phone = re.sub(r'[^\d+]', '', phone)
        
        # Si es chileno sin código, agregarlo
        if len(phone) == 9 and phone[0] in ['9', '2']:
            phone = '+56' + phone
            
        return phone[:15]


