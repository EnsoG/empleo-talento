import re
import os
from typing import Dict, List, Optional, Tuple
from datetime import date, datetime
import pdfplumber
from docx import Document

class CVParserService:
    
    def __init__(self):
        self.temp_dir = "src/temp/resumes"
        os.makedirs(self.temp_dir, exist_ok=True)
        self.patterns = self._initialize_patterns()
        self.months_es = {
            'enero': 1, 'febrero': 2, 'marzo': 3, 'abril': 4,
            'mayo': 5, 'junio': 6, 'julio': 7, 'agosto': 8,
            'septiembre': 9, 'octubre': 10, 'noviembre': 11, 'diciembre': 12,
            'ene': 1, 'feb': 2, 'mar': 3, 'abr': 4,
            'may': 5, 'jun': 6, 'jul': 7, 'ago': 8,
            'sep': 9, 'sept': 9, 'oct': 10, 'nov': 11, 'dic': 12
        }
        
    def _initialize_patterns(self):
        return {
            'email': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            'phone': r'[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}',
            'date_patterns': [
                r'([A-Za-z]+)\s+(\d{4})\s*[-–—]\s*(presente|actual|actualidad|today|current)',
                r'([A-Za-z]+)\s+(\d{4})\s*[-–—]\s*([A-Za-z]+)\s+(\d{4})',
                r'(\d{4})\s*[-–—]\s*(\d{4})',
                r'(\d{4})\s*[-–—]\s*(presente|actual|actualidad)',
                r'(\d{4})',
            ],
            'sections': {
                'experiencia': [
                    'experiencia laboral', 'experiencia profesional',
                    'experience', 'work experience', 'experiencia',
                    'empleos anteriores', 'historial laboral'
                ],
                'educacion': [
                    'educación', 'educacion', 'formación académica',
                    'education', 'estudios', 'formacion academica',
                    'preparación académica'
                ],
                'habilidades': [
                    'habilidades', 'skills', 'competencias',
                    'conocimientos', 'aptitudes', 'herramientas'
                ],
                'idiomas': [
                    'idiomas', 'languages', 'lenguas'
                ]
            }
        }
    
    async def parse_resume(self, file_path: str) -> Dict:
        """
        Parsea el CV y extrae información básica
        """
        try:
            # Extraer texto del archivo
            text = self._extract_text(file_path)
            if not text:
                print("No se pudo extraer texto del archivo")
                return self._get_empty_structure()
            
            # Extraer secciones
            sections = self._extract_sections(text)
            
            # Extraer información estructurada
            education = self._extract_education_with_dates(sections.get('educacion', ''))
            work_experience = self._extract_experience_with_dates(sections.get('experiencia', ''))
            languages = self._extract_languages(sections.get('idiomas', ''))
            skills = self._extract_skills(text)
            
            # Asegurar que todo sea del tipo correcto
            education = self._ensure_list_of_dicts(education, 'education')
            work_experience = self._ensure_list_of_dicts(work_experience, 'work_experience')
            languages = self._ensure_list_of_dicts(languages, 'languages')
            
            # Construir resultado
            formatted_data = {
                "personal_info": {
                    "name": self._parse_full_name(self._extract_name(text)),
                    "email": self._extract_email(text),
                    "phone": self._extract_phone(text)
                },
                "education": education,
                "work_experience": work_experience,
                "languages": languages,
                "software_skills": [{"software": skill, "level": "Intermedio"} for skill in skills]
            }
            
            print(f"Parsing exitoso. Email: {formatted_data['personal_info']['email']}")
            print(f"Educación encontrada: {len(education)} items")
            print(f"Experiencia encontrada: {len(work_experience)} items")
            
            return formatted_data
            
        except Exception as e:
            print(f"Error parsing CV: {str(e)}")
            import traceback
            traceback.print_exc()
            return self._get_empty_structure()
    
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
    
    def _ensure_list_of_dicts(self, data: any, field_name: str) -> List[Dict]:
        """
        Asegura que el dato sea una lista de diccionarios
        """
        if not isinstance(data, list):
            print(f"Warning: {field_name} no es una lista, es {type(data)}")
            return []
        
        valid_items = []
        for item in data:
            if isinstance(item, dict):
                valid_items.append(item)
            else:
                print(f"Warning: Item en {field_name} no es dict: {type(item)} - {item}")
        
        return valid_items
    
    def _extract_education_with_dates(self, text: str) -> List[Dict]:
        """
        Extrae educación con fechas - SIEMPRE retorna lista de diccionarios
        """
        education = []
        
        if not text or not isinstance(text, str):
            return education
        
        # Limpiar caracteres especiales
        text = text.replace('\uf071', '').replace('\u2022', '•')
        
        # Patrones de títulos
        degree_patterns = [
                (r'licenciatura\\s+(?:en\\s+)?([^\\n,•]+)', 'Licenciatura'),
                (r'ingenier[íi]a\\s+(?:en\\s+)?([^\\n,•]+)', 'Ingeniería'),
                (r'maestr[íi]a\\s+(?:en\\s+)?([^\\n,•]+)', 'Maestría'),
                (r'master\\s+(?:en\\s+)?([^\\n,•]+)', 'Master'),
                (r'doctorado\\s+(?:en\\s+)?([^\\n,•]+)', 'Doctorado'),
                (r't[ée]cnico\\s+(?:en\\s+|superior\\s+en\\s+)?([^\\n,•]+)', 'Técnico'),
                (r'diplomado\\s+(?:en\\s+)?([^\\n,•]+)', 'Diplomado'),
                (r'bachillerato\\s+(?:en\\s+)?([^\\n,•]+)', 'Bachillerato'),
                (r'carrera\\s+(?:de\\s+|en\\s+)?([^\\n,•]+)', 'Carrera'),
                (r'título\\s+(?:de\\s+|en\\s+)?([^\\n,•]+)', 'Título')
            ]
        
        lines = [line.strip() for line in text.split('\\n') if line.strip()]
        
        # Procesar línea por línea buscando títulos
        i = 0
        while i < len(lines):
            line = lines[i]
            
            # Buscar si la línea contiene un título
            title_found = False
            for pattern, degree_type in degree_patterns:
                match = re.search(pattern, line, re.IGNORECASE)
                if match:
                    field = match.group(1).strip()
                    
                    # Buscar institución en las siguientes líneas
                    institution = "No especificada"
                    start_date = None
                    end_date = None
                    
                    # Revisar las siguientes 3 líneas para institución y fechas
                    for j in range(i+1, min(i+4, len(lines))):
                        next_line = lines[j]
                        
                        # Buscar institución
                        if self._is_institution_line(next_line):
                            institution = next_line[:200]
                        
                        # Buscar fechas
                        dates = self._extract_dates_from_text(next_line)
                        if dates[0]:
                            start_date, end_date = dates
                    
                    # Si no encontramos fechas, buscar en la línea actual
                    if not start_date:
                        start_date, end_date = self._extract_dates_from_text(line)
                    
                    # Crear item de educación
                    edu_item = {
                        "title": f"{degree_type} en {field}"[:200],
                        "institution": institution,
                        "start_date": start_date if start_date else date(2020, 1, 1),
                        "end_date": end_date
                    }
                    education.append(edu_item)
                    title_found = True
                    print(f"Educación encontrada: {edu_item['title']} en {edu_item['institution']}")
                    break
            
            i += 1
        
        # Si no encontramos nada con patrones, buscar por bloques
        if not education:
            blocks = re.split(r'\\n\\s*\\n|•', text)
            for block in blocks[:5]:
                if len(block.strip()) > 20:
                    lines_in_block = [l.strip() for l in block.split('\\n') if l.strip()]
                    if lines_in_block:
                        start_date, end_date = self._extract_dates_from_text(block)
                        institution = self._find_institution_in_block(block)
                        
                        edu_item = {
                            "title": lines_in_block[0][:200],
                            "institution": institution,
                            "start_date": start_date if start_date else date(2020, 1, 1),
                            "end_date": end_date
                        }
                        education.append(edu_item)
                        print(f"Educación por bloque: {edu_item['title']}")
        
        print(f"Total educación encontrada: {len(education)}")
        return education
    
    def _extract_experience_with_dates(self, text: str) -> List[Dict]:
        """
        Extrae experiencia laboral con fechas - SIEMPRE retorna lista de diccionarios
        """
        experiences = []
        
        if not text or not isinstance(text, str):
            return experiences
        
        print(f"Procesando experiencia. Texto length: {len(text)}")
        
        # Limpiar caracteres especiales
        text = text.replace('\\uf071', '').replace('\\u2022', '•')
        
        # Dividir por bullets o dobles saltos de línea
        blocks = re.split(r'\\n\\s*\\n|(?=•)|(?=\\d+\\.)', text)
        
        for i, block in enumerate(blocks):
            if len(block.strip()) < 15:  # Muy corto
                continue
                
            print(f"Procesando bloque {i+1}: {block[:100]}...")
            
            lines = [line.strip() for line in block.split('\\n') if line.strip()]
            
            if not lines:
                continue
            
            # Extraer fechas del bloque completo
            start_date, end_date = self._extract_dates_from_text(block)
            
            # Primera línea limpia (sin fechas) como posición
            first_line = lines[0]
            
            # Limpiar fechas y símbolos de la primera línea
            position = first_line
            for pattern in self.patterns['date_patterns']:
                position = re.sub(pattern, '', position, flags=re.IGNORECASE)
            position = re.sub(r'[-–—•\\.\\d+\\.]', '', position).strip()
            
            if not position:
                position = "Posición no especificada"
            
            # Buscar empresa en las siguientes líneas
            company = "No especificada"
            for line in lines[1:4]:  # Revisar hasta 3 líneas siguientes
                if self._is_company_line(line):
                    company = line[:150]
                    break
            
            # Si no encontramos empresa, usar la segunda línea si existe
            if company == "No especificada" and len(lines) > 1:
                company = lines[1][:150]
            
            # Crear item de experiencia
            exp_item = {
                "position": position[:150],
                "company": company,
                "description": "",
                "start_date": start_date if start_date else date(2020, 1, 1),
                "end_date": end_date
            }
            experiences.append(exp_item)
            print(f"Experiencia encontrada: {exp_item['position']} en {exp_item['company']}")
            
            # Limitar a 10 experiencias
            if len(experiences) >= 10:
                break
        
        print(f"Total experiencias encontradas: {len(experiences)}")
        return experiences
    def _is_institution_line(self, line: str) -> bool:
        """
        Determina si una línea contiene una institución educativa
        """
        inst_keywords = [
            'universidad', 'university', 'instituto', 'institute',
            'escuela', 'school', 'colegio', 'college', 'inacap',
            'duoc', 'usach', 'uchile', 'puc', 'uai', 'udp',
            'utem', 'unab', 'udd', 'ucentral', 'ucen'
        ]
        
        line_lower = line.lower()
        return any(keyword in line_lower for keyword in inst_keywords)

    def _is_company_line(self, line: str) -> bool:
        """
        Determina si una línea contiene una empresa
        """
        company_indicators = [
            'ltda', 's.a.', 'spa', 'empresa', 'company', 'corp',
            'inc', 'group', 'grupo', 'holding', 'consultora',
            'servicios', 'solutions', 'tech', 'systems'
        ]
        
        line_lower = line.lower()
        
        # Si contiene indicadores de empresa
        if any(indicator in line_lower for indicator in company_indicators):
            return True
        
        # Si es una línea corta sin fechas (probable nombre de empresa)
        if len(line) < 80 and not re.search(r'\\d{4}', line):
            return True
        
        return False    
    def _extract_languages(self, text: str) -> List[Dict]:
        """
        Extrae idiomas - SIEMPRE retorna lista de diccionarios
        """
        languages = []
        
        if not text or not isinstance(text, str):
            return languages
        
        language_patterns = {
            'Español': ['español', 'spanish', 'castellano'],
            'Inglés': ['inglés', 'ingles', 'english'],
            'Francés': ['francés', 'frances', 'french'],
            'Alemán': ['alemán', 'aleman', 'german'],
            'Portugués': ['portugués', 'portugues', 'portuguese'],
            'Italiano': ['italiano', 'italian'],
            'Chino': ['chino', 'chinese', 'mandarín', 'mandarin']
        }
        
        text_lower = text.lower()
        
        for lang_name, patterns in language_patterns.items():
            for pattern in patterns:
                if pattern in text_lower:
                    # Crear diccionario con estructura correcta
                    lang_item = {
                        "language": lang_name,
                        "level": "Intermedio"
                    }
                    languages.append(lang_item)
                    break
        
        return languages
    
    def _extract_dates_from_text(self, text: str) -> Tuple[Optional[date], Optional[date]]:
        """
        Extrae fechas de inicio y fin de un texto
        """
        text = text.strip()
        start_date = None
        end_date = None
        
        # Probar cada patrón
        for pattern in self.patterns['date_patterns']:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                groups = match.groups()
                
                try:
                    if len(groups) == 2:
                        if groups[1].lower() in ['presente', 'actual', 'actualidad', 'today', 'current']:
                            # Mes Año - Presente
                            month = self.months_es.get(groups[0].lower(), 1)
                            year = datetime.now().year
                            start_date = date(year, month, 1)
                            end_date = None
                        elif groups[0].isdigit() and groups[1].isdigit():
                            # Año - Año
                            start_date = date(int(groups[0]), 1, 1)
                            end_date = date(int(groups[1]), 12, 31)
                    
                    elif len(groups) == 3:
                        # Mes Año - Presente
                        month = self.months_es.get(groups[0].lower(), 1)
                        year = int(groups[1])
                        start_date = date(year, month, 1)
                        end_date = None
                    
                    elif len(groups) == 4:
                        # Mes Año - Mes Año
                        start_month = self.months_es.get(groups[0].lower(), 1)
                        start_year = int(groups[1])
                        end_month = self.months_es.get(groups[2].lower(), 12)
                        end_year = int(groups[3])
                        start_date = date(start_year, start_month, 1)
                        end_date = date(end_year, end_month, 1)
                    
                    elif len(groups) == 1 and groups[0].isdigit():
                        # Solo año
                        year = int(groups[0])
                        start_date = date(year, 1, 1)
                        end_date = date(year, 12, 31)
                
                except (ValueError, TypeError):
                    continue
                
                if start_date:
                    break
        
        # Fecha por defecto si no se encuentra
        if not start_date:
            start_date = date(2020, 1, 1)
        
        return start_date, end_date
    
    # ... resto de métodos auxiliares permanecen igual ...
    
    def _extract_text(self, file_path: str) -> str:
        """Extrae texto de PDF o DOCX"""
        text = ""
        
        try:
            if file_path.lower().endswith('.pdf'):
                print("Extrayendo texto de PDF...")
                with pdfplumber.open(file_path) as pdf:
                    for i, page in enumerate(pdf.pages):
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text + "\n"
                        print(f"Página {i+1} procesada")
            
            elif file_path.lower().endswith(('.docx', '.doc')):
                print("Extrayendo texto de DOCX...")
                doc = Document(file_path)
                text = "\n".join([para.text for para in doc.paragraphs if para.text])
                
        except Exception as e:
            print(f"Error extracting text: {e}")
            
        print(f"Texto extraído: {len(text)} caracteres")
        return text
    
    def _extract_name(self, text: str) -> str:
        """Intenta extraer el nombre del CV"""
        lines = [line.strip() for line in text.split('\n') if line.strip()][:10]
        
        for line in lines:
            words = line.split()
            if 2 <= len(words) <= 4:
                is_section = any(
                    section.lower() in line.lower() 
                    for sections in self.patterns['sections'].values() 
                    for section in sections
                )
                
                if not is_section and not re.search(r'\d', line):
                    if all(word[0].isupper() for word in words if len(word) > 2):
                        return line
        
        return ""
    
    def _extract_email(self, text: str) -> str:
        """Extrae email"""
        matches = re.findall(self.patterns['email'], text)
        return matches[0] if matches else ""
    
    def _extract_phone(self, text: str) -> str:
        """Extrae teléfono"""
        matches = re.findall(self.patterns['phone'], text)
        if matches:
            phone = re.sub(r'[^\d+]', '', matches[0])
            return phone
        return ""
    
    def _extract_sections(self, text: str) -> Dict[str, str]:
        """Divide el texto en secciones"""
        sections = {}
        lines = text.split('\n')
        
        current_section = None
        current_content = []
        
        for i, line in enumerate(lines):
            line_clean = line.strip().lower()
            
            for section_name, keywords in self.patterns['sections'].items():
                if any(keyword in line_clean for keyword in keywords):
                    if current_section:
                        sections[current_section] = '\n'.join(current_content)
                    
                    current_section = section_name
                    current_content = []
                    break
            else:
                if current_section and line.strip():
                    current_content.append(line)
        
        if current_section:
            sections[current_section] = '\n'.join(current_content)
        
        return sections
    
    def _extract_skills(self, text: str) -> List[str]:
        """Extrae habilidades técnicas comunes"""
        skills = []
        
        tech_skills = [
            'python', 'java', 'javascript', 'typescript', 'c#', 'c++', 'php', 'ruby', 'go', 'rust',
            'swift', 'kotlin', 'r', 'matlab', 'sql', 'bash', 'perl', 'scala',
            'react', 'angular', 'vue', 'node.js', 'nodejs', 'express', 'django', 'flask', 'fastapi',
            'spring', 'spring boot', '.net', 'laravel', 'rails', 'symfony',
            'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'cassandra', 'oracle',
            'sql server', 'dynamodb', 'firebase',
            'aws', 'azure', 'google cloud', 'gcp', 'docker', 'kubernetes', 'jenkins', 'gitlab',
            'github', 'git', 'terraform', 'ansible', 'ci/cd',
            'linux', 'windows', 'macos', 'agile', 'scrum', 'jira', 'confluence',
            'machine learning', 'deep learning', 'ai', 'data science', 'pandas', 'numpy',
            'tensorflow', 'pytorch', 'scikit-learn', 'keras','power bi', 'tableau',
            'excel', 'excel avanzado', 'excel vba', 'power query', 'power pivot',
            'business intelligence', 'data visualization', 'data analysis',
            'big data', 'hadoop', 'spark', 'kafka', 'elasticsearch',
            'web development', 'mobile development', 'full stack', 'frontend', 'backend',
            'ui/ux', 'responsive design', 'html', 'css', 'sass', 'less',
            'bootstrap', 'tailwind', 'material design', 'vue.js', 'react native', 'flutter',
            'ionic', 'cordova', 'xamarin', 'swiftui', 'jetpack compose',
            'api', 'rest', 'graphql', 'soap', 'web services',   
            'excel', 'word', 'powerpoint', 'outlook', 'google sheets    ', 'google docs'
        ]
        
        text_lower = text.lower()
        
        for skill in tech_skills:
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text_lower):
                skills.append(skill)
        
        return list(set(skills))
    
    def _parse_full_name(self, full_name: str) -> Dict[str, str]:
        """Separa el nombre completo en partes"""
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
    
    def _find_institution_in_block(self, text: str) -> str:
        """Busca una institución educativa en un bloque de texto"""
        inst_keywords = ['universidad', 'university', 'instituto', 'institute',
                        'escuela', 'school', 'colegio', 'college', 'inacap',
                        'duoc', 'usach', 'uchile', 'puc', 'uai']
        
        lines = text.split('\n')
        for line in lines:
            line_lower = line.lower()
            for keyword in inst_keywords:
                if keyword in line_lower:
                    return line.strip()[:200]
        
        return "No especificada"