# services/cv_data_populator.py
from sqlmodel import Session, select
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, date
from typing import Dict, Optional

from models.candidate import Candidate
from models.candidate_study import CandidateStudy
from models.work_experience import WorkExperience
from models.candidate_language import CandidateLanguage
from models.language import Language
from models.language_level import LanguageLevel
from models.software import Software
from models.candidate_software import CandidateSoftware
from models.candidate_certification import CandidateCertification
from models.knownledge_level import KnownledgeLevel


class CVDataPopulator:
    def __init__(self, session: AsyncSession):
        self.session = session
        
    async def populate_candidate_data(self, candidate_run: str, parsed_data: Dict) -> Dict:
        """
        Pobla las tablas relacionadas con los datos parseados del CV
        """
        results = {
            "education": 0,
            "experience": 0,
            "languages": 0,
            "software": 0,
            "errors": []
        }
        
        try:
            # Actualizar información personal básica si está disponible
            await self._update_personal_info(candidate_run, parsed_data.get('personal_info', {}))
            
            # Poblar educación
            education_data = parsed_data.get('education', [])
            for edu in education_data:
                if await self._add_education(candidate_run, edu):
                    results['education'] += 1
            
            # Poblar experiencia laboral
            experience_data = parsed_data.get('work_experience', [])
            for exp in experience_data:
                if await self._add_experience(candidate_run, exp):
                    results['experience'] += 1
            
            # Poblar idiomas
            languages_data = parsed_data.get('languages', [])
            for lang in languages_data:
                if await self._add_language(candidate_run, lang):
                    results['languages'] += 1
            
            # Poblar software/habilidades técnicas
            software_data = parsed_data.get('software_skills', [])
            for soft in software_data:
                if await self._add_software(candidate_run, soft):
                    results['software'] += 1
            
            await self.session.commit()
            
        except Exception as e:
            await self.session.rollback()
            results['errors'].append(str(e))
            
        return results
    
    async def _update_personal_info(self, candidate_run: str, personal_info: Dict):
        """
        Actualiza información personal si hay datos nuevos
        """
        candidate = await self.session.get(Candidate, candidate_run)
        if not candidate:
            return
        
        # Solo actualizar si el campo está vacío y tenemos datos nuevos
        name_parts = personal_info.get('name', {})
        if isinstance(name_parts, dict):
            if not candidate.name and name_parts.get('name'):
                candidate.name = name_parts['name']
            if not candidate.paternal and name_parts.get('paternal'):
                candidate.paternal = name_parts['paternal']
            if not candidate.maternal and name_parts.get('maternal'):
                candidate.maternal = name_parts['maternal']
        
        if not candidate.phone and personal_info.get('phone'):
            candidate.phone = personal_info['phone']
            
        self.session.add(candidate)
    
    async def _add_education(self, candidate_run: str, education: Dict) -> bool:
        """
        Agrega un registro de educación
        """
        try:
            # Verificar que tengamos al menos título e institución
            if not education.get('title'):
                return False
            
            # Verificar si ya existe
            stmt = select(CandidateStudy).where(
                CandidateStudy.run == candidate_run,
                CandidateStudy.title == education['title'][:200]
            )
            result = await self.session.execute(stmt)
            if result.scalar_one_or_none():
                return False
            
            study = CandidateStudy(
                run=candidate_run,
                title=education['title'][:200],  # Limitar longitud
                institution=education.get('institution', 'No especificada')[:200],
                start_date=education.get('start_date', date(2020, 1, 1)),  # Fecha por defecto
                end_date=education.get('end_date')
            )
            
            self.session.add(study)
            return True
            
        except Exception as e:
            print(f"Error adding education: {e}")
            return False
    
    async def _add_experience(self, candidate_run: str, experience: Dict) -> bool:
        """
        Agrega experiencia laboral - MEJORADO para duplicados
        """
        try:
            position = experience.get('position', '').strip()
            company = experience.get('company', 'No especificada').strip()
            
            if not position:
                return False
            
            # ✅ MEJORAR: Verificar duplicados por CARGO + EMPRESA
            stmt = select(WorkExperience).where(
                WorkExperience.run == candidate_run,
                WorkExperience.position.ilike(f"%{position}%"),
                WorkExperience.company.ilike(f"%{company}%")  # Agregar empresa
            )
            result = await self.session.execute(stmt)
            existing = result.scalar_one_or_none()
            
            if existing:
                print(f"ℹ️ Experiencia duplicada: {position} en {company}")
                return False
            
            # Parsear fechas
            start_date = self._parse_work_date(experience.get('start_date'))
            end_date = self._parse_work_date(experience.get('end_date'))
            
            if not start_date:
                start_date = date(2000, 1, 1)
            
            work_exp = WorkExperience(
                run=candidate_run,
                position=position[:150],
                company=company[:150],
                description=experience.get('description', '')[:1000],
                start_date=start_date,
                end_date=end_date
            )
            
            self.session.add(work_exp)
            print(f"✅ Experiencia agregada: {position} en {company}")
            return True
        
        except Exception as e:
            print(f"❌ Error adding experience: {e}")
            return False

    def _parse_work_date(self, date_input) -> Optional[date]:
        """
        Parsea fechas de experiencia laboral
        """
        if not date_input:
            return None
        
        # Si ya es un objeto date
        if isinstance(date_input, date):
            return date_input
        
        # Si es datetime
        if isinstance(date_input, datetime):
            return date_input.date()
        
        # Si es string
        if isinstance(date_input, str):
            date_str = date_input.strip().lower()
            
            # Casos especiales
            if date_str in ['presente', 'actual', 'current', 'now', '', 'null']:
                return None
            
            # Formatos comunes
            formats = [
                '%Y-%m-%d',      # 2023-01-15
                '%d/%m/%Y',      # 15/01/2023
                '%m/%Y',         # 01/2023
                '%Y',            # 2023
            ]
            
            for fmt in formats:
                try:
                    return datetime.strptime(date_str, fmt).date()
                except ValueError:
                    continue
            
            # Extraer solo el año si no funciona nada
            import re
            year_match = re.search(r'(19|20)\d{2}', date_str)
            if year_match:
                year = int(year_match.group())
                return date(year, 1, 1)
        
        return None
    async def _get_language_level(self, level_name: str) -> LanguageLevel:
        """
        Obtiene el nivel de idioma de la BD o crea uno por defecto
        """
        # Mapeo de niveles comunes
        level_mapping = {
            'basico': 'Básico',
            'basic': 'Básico',
            'intermedio': 'Intermedio',
            'intermediate': 'Intermedio',
            'avanzado': 'Avanzado',
            'advanced': 'Avanzado',
            'nativo': 'Nativo',
            'native': 'Nativo'
        }
        
        normalized_level = level_mapping.get(level_name.lower(), 'Intermedio')
        
        # Buscar el nivel en la BD
        stmt = select(LanguageLevel).where(LanguageLevel.name == normalized_level)
        result = await self.session.execute(stmt)
        level = result.scalar_one_or_none()
        
        if not level:
            # Si no existe, crear uno nuevo
            level = LanguageLevel(name=normalized_level)
            self.session.add(level)
            await self.session.flush()
            
        return level
    
    async def _get_knowledge_level(self, level_name: str) -> KnownledgeLevel:
        """
        Obtiene el nivel de conocimiento de la BD o crea uno por defecto
        """
        # Mapeo similar para conocimientos
        level_mapping = {
            'basico': 'Básico',
            'basic': 'Básico',
            'intermedio': 'Intermedio',
            'intermediate': 'Intermedio',
            'avanzado': 'Avanzado',
            'advanced': 'Avanzado',
            'experto': 'Experto',
            'expert': 'Experto'
        }
        
        normalized_level = level_mapping.get(level_name.lower(), 'Intermedio')
        
        stmt = select(KnownledgeLevel).where(KnownledgeLevel.name == normalized_level)
        result = await self.session.execute(stmt)
        level = result.scalar_one_or_none()
        
        if not level:
            level = KnownledgeLevel(name=normalized_level)
            self.session.add(level)
            await self.session.flush()
            
        return level
    
    async def _add_language(self, candidate_run: str, language_data: Dict) -> bool:
        """
        Versión robusta que maneja duplicados correctamente
        """
        try:
            # Validar entrada
            if not isinstance(language_data, dict):
                return False
                
            language_name = language_data.get('language', '').strip()
            if not language_name or len(language_name) < 2:
                print(f"⚠️ Language name inválido: '{language_name}'")
                return False
            
            # Normalizar nombre del idioma
            language_name = language_name.title()  # "español" -> "Español"
            
            # ✅ Buscar idioma con LIMIT 1 para evitar múltiples resultados
            stmt = select(Language).where(
                Language.name.ilike(language_name)
            ).limit(1)
            
            result = await self.session.execute(stmt)
            language = result.scalar_one_or_none()
            
            if not language:
                # Verificar si existe con variaciones
                variations = [
                    language_name.lower(),
                    language_name.upper(), 
                    language_name.title()
                ]
                
                for variation in variations:
                    stmt_var = select(Language).where(
                        Language.name.ilike(f"%{variation}%")
                    ).limit(1)
                    result_var = await self.session.execute(stmt_var)
                    language = result_var.scalar_one_or_none()
                    if language:
                        break
                
                # Si aún no existe, crear nuevo
                if not language:
                    language = Language(name=language_name)
                    self.session.add(language)
                    await self.session.flush()
            
            # Verificar duplicados en relación candidato-idioma
            existing_stmt = select(CandidateLanguage).where(
                CandidateLanguage.run == candidate_run,
                CandidateLanguage.language_id == language.language_id
            )
            existing_result = await self.session.execute(existing_stmt)
            if existing_result.scalar_one_or_none():
                return False
            
            # Obtener nivel con validación
            level_name = language_data.get('level', 'Intermedio').strip()
            if not level_name:
                level_name = 'Intermedio'
                
            level = await self._get_language_level(level_name)
            
            # Crear relación
            candidate_lang = CandidateLanguage(
                run=candidate_run,
                language_id=language.language_id,
                level_id=level.level_id
            )
            
            self.session.add(candidate_lang)
            return True
            
        except Exception as e:
            print(f"❌ Error adding language: {e}")
        return False
    
    async def _add_software(self, candidate_run: str, software_data: Dict) -> bool:
        """
        Agrega una habilidad de software al candidato - VERSIÓN COMPLETA
        """
        try:
            software_name = software_data.get('software', '').strip()
            if not software_name or len(software_name) < 2:
                print(f"⚠️ Software name inválido: {software_data}")
                return False
            
            # Extraer y limpiar nivel
            level_from_name = self._extract_level_from_software_name(software_name)
            level_from_data = software_data.get('level', '').strip()
            
            final_level = level_from_name or level_from_data or 'Intermedio'
            clean_software_name = self._clean_software_name(software_name)
            
            # ✅ PASO 1: Buscar o crear software
            stmt = select(Software).where(Software.name.ilike(f"%{clean_software_name}%")).limit(1)
            result = await self.session.execute(stmt)
            software_row = result.first()
            
            if software_row:
                software = software_row[0]
                print(f"🔍 Software encontrado: {software.name} (ID: {software.software_id})")
            else:
                software = Software(name=clean_software_name)
                self.session.add(software)
                await self.session.flush()  # ✅ IMPORTANTE: flush para obtener ID
                print(f"🆕 Software creado: {software.name} (ID: {software.software_id})")
            
            # ✅ PASO 2: Verificar si ya existe la relación candidato-software
            existing_stmt = select(CandidateSoftware).where(
                CandidateSoftware.run == candidate_run,
                CandidateSoftware.software_id == software.software_id
            )
            existing_result = await self.session.execute(existing_stmt)
            existing_relation = existing_result.first()
            
            if existing_relation:
                print(f"ℹ️ Relación ya existe: {candidate_run} - {software.name}")
                return False
            
            # ✅ PASO 3: Obtener nivel (CRÍTICO - verificar que existe)
            try:
                level = await self._get_knowledge_level(final_level)
                print(f"🎯 Nivel obtenido: {final_level} (ID: {level.level_id})")
            except Exception as level_error:
                print(f"❌ Error obteniendo nivel '{final_level}': {level_error}")
                # Usar nivel por defecto
                level = await self._get_knowledge_level('Intermedio')
            
            # ✅ PASO 4: Crear la relación candidato-software
            candidate_soft = CandidateSoftware(
                run=candidate_run,
                software_id=software.software_id,
                level_id=level.level_id
            )
            
            self.session.add(candidate_soft)
            
            # ✅ PASO 5: Flush para verificar que se guardó
            await self.session.flush()
            
            print(f"✅ RELACIÓN CREADA: {candidate_run} -> {clean_software_name} ({final_level})")
            print(f"   Software ID: {software.software_id}, Level ID: {level.level_id}")
            
            return True
            
        except Exception as e:
            print(f"❌ Error adding software: {e}")
            import traceback
            traceback.print_exc()
            
            # Rollback en caso de error
            try:
                await self.session.rollback()
            except:
                pass
            return False

    def _extract_level_from_software_name(self, software_name: str) -> str:
        """Extrae el nivel del nombre del software"""
        software_lower = software_name.lower()
        
        if 'básico' in software_lower or 'basico' in software_lower:
            return 'Básico'
        elif 'intermedio' in software_lower:
            return 'Intermedio'  
        elif 'avanzado' in software_lower:
            return 'Avanzado'
        elif 'experto' in software_lower or 'expert' in software_lower:
            return 'Experto'
        
        return ''  # No se encontró nivel

    def _clean_software_name(self, software_name: str) -> str:
        """Limpia el nombre del software removiendo indicadores de nivel"""
        clean_name = software_name
        
        # Remover indicadores de nivel
        level_indicators = ['básico', 'basico', 'intermedio', 'avanzado', 'experto', 'expert']
        
        for indicator in level_indicators:
            clean_name = clean_name.replace(indicator, '').replace(indicator.title(), '')
        
        # Limpiar espacios extra
        clean_name = ' '.join(clean_name.split())
        
        return clean_name.strip()
    async def _get_knowledge_level(self, level_name: str):
        """
        Obtiene el nivel de conocimiento - CORREGIDO
        """
        try:
            # Normalizar nombre del nivel
            level_mapping = {
                'básico': 'Básico',
                'basico': 'Básico',
                'basic': 'Básico',
                'beginner': 'Básico',
                'principiante': 'Básico',
                
                'intermedio': 'Intermedio',
                'intermediate': 'Intermedio',
                'medio': 'Intermedio',
                
                'avanzado': 'Avanzado',
                'advanced': 'Avanzado',
                'alto': 'Avanzado',
                
                'experto': 'Experto',
                'expert': 'Experto',
                'profesional': 'Experto'
            }
            
            normalized_level = level_mapping.get(level_name.lower(), level_name)
            
            # Buscar en la base de datos
            stmt = select(KnownledgeLevel).where(
                KnownledgeLevel.name.ilike(f"%{normalized_level}%")
            ).limit(1)
            
            result = await self.session.execute(stmt)
            level = result.scalar_one_or_none()
            
            if not level:
                print(f"⚠️ Nivel '{level_name}' no encontrado, usando Intermedio")
                # Buscar Intermedio como fallback
                stmt_fallback = select(KnownledgeLevel).where(
                    KnownledgeLevel.name.ilike("%intermedio%")
                ).limit(1)
                result_fallback = await self.session.execute(stmt_fallback)
                level = result_fallback.scalar_one_or_none()
            
            print(f"🎯 Nivel '{level_name}' -> '{level.name}' (ID: {level.level_id})")
            return level
            
        except Exception as e:
            print(f"❌ Error getting knowledge level: {e}")
            raise