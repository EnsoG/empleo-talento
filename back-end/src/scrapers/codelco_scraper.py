"""
Scraper para empleos de Codelco
Este módulo extrae las ofertas laborales del sitio web de empleos de Codelco
"""

import asyncio
import aiohttp
import json
from datetime import datetime
from typing import List, Dict, Optional
from dataclasses import dataclass
from bs4 import BeautifulSoup
import re
from urllib.parse import urljoin, urlparse, parse_qs
import sys
import os

# Agregar al path para imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.codelco_job import CodelcoJob, CodelcoJobCreate
from config.db import get_session
from sqlmodel import select


@dataclass
class JobOffer:
    """Clase que representa una oferta laboral de Codelco"""
    id_proceso: str
    titulo: str
    url: str
    fecha: str
    region: str
    codigo_postal: str
    ubicacion: str
    descripcion: Optional[str] = None
    requisitos: Optional[str] = None
    fecha_scraped: str = None

    def __post_init__(self):
        if self.fecha_scraped is None:
            self.fecha_scraped = datetime.now().isoformat()


class CodelcoScraper:
    """Scraper para el sitio de empleos de Codelco"""
    
    def __init__(self):
        self.base_url = "https://empleos.codelco.cl"
        self.search_url = f"{self.base_url}/search/"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        }

    async def fetch_page(self, session: aiohttp.ClientSession, url: str) -> str:
        """Obtiene el contenido HTML de una página"""
        try:
            async with session.get(url, headers=self.headers) as response:
                if response.status == 200:
                    return await response.text()
                else:
                    print(f"Error al obtener {url}: Status {response.status}")
                    return ""
        except Exception as e:
            print(f"Error al obtener {url}: {e}")
            return ""

    def extract_job_links_and_basic_info(self, html: str) -> List[Dict]:
        """Extrae los enlaces y información básica de los trabajos desde la página de búsqueda"""
        soup = BeautifulSoup(html, 'html.parser')
        jobs = []
        
        # Buscar todos los enlaces de trabajos con la clase específica
        job_links = soup.find_all('a', class_='jobTitle-link')
        
        print(f"🔍 Encontrados {len(job_links)} enlaces de trabajos con clase 'jobTitle-link'")
        
        for link in job_links:
            try:
                href = link.get('href', '')
                if '/job/' not in href:
                    continue
                    
                # Extraer información del enlace
                full_url = urljoin(self.base_url, href)
                title = link.get_text(strip=True)
                
                if not title or len(title) < 3:
                    continue
                
                print(f"   📋 Procesando: {title[:50]}...")
                
                # Extraer el ID del job del atributo data-focus-tile
                data_focus = link.get('data-focus-tile', '')
                job_id_match = re.search(r'job-id-(\d+)', data_focus)
                job_internal_id = job_id_match.group(1) if job_id_match else ""
                
                if not job_internal_id:
                    # Intentar extraer del href
                    href_match = re.search(r'/(\d+)/?$', href)
                    job_internal_id = href_match.group(1) if href_match else ""
                
                if job_internal_id:
                    # Buscar los datos específicos usando el ID del trabajo
                    
                    # ID de proceso
                    id_proceso_elem = soup.find('div', id=f'job-{job_internal_id}-desktop-section-customfield1-value')
                    id_proceso = id_proceso_elem.get_text(strip=True) if id_proceso_elem else ""
                    
                    # Fecha
                    fecha_elem = soup.find('div', id=f'job-{job_internal_id}-desktop-section-date-value')
                    fecha = fecha_elem.get_text(strip=True) if fecha_elem else ""
                    
                    # Región
                    region_elem = soup.find('div', id=f'job-{job_internal_id}-desktop-section-customfield2-value')
                    region = region_elem.get_text(strip=True) if region_elem else ""
                    
                    # Código postal
                    codigo_postal_elem = soup.find('div', id=f'job-{job_internal_id}-desktop-section-zip-value')
                    codigo_postal = codigo_postal_elem.get_text(strip=True) if codigo_postal_elem else ""
                    
                    # Crear el objeto del trabajo
                    job_data = {
                        'titulo': title,
                        'url': full_url,
                        'id_proceso': id_proceso or job_internal_id,
                        'fecha': fecha,
                        'region': region,
                        'codigo_postal': codigo_postal,
                        'ubicacion': f"{region} - {codigo_postal}".strip(" -") if region or codigo_postal else "",
                        'job_internal_id': job_internal_id
                    }
                    
                    jobs.append(job_data)
                    print(f"      ✅ Agregado: ID {id_proceso}, Fecha: {fecha}, Región: {region}")
                    
                else:
                    print(f"      ⚠️  No se pudo extraer ID interno para: {title[:30]}")
                    
            except Exception as e:
                print(f"      ❌ Error procesando enlace: {e}")
                continue
        
        # Eliminar duplicados basándose en URL
        unique_jobs = []
        seen_urls = set()
        for job in jobs:
            if job['url'] not in seen_urls:
                unique_jobs.append(job)
                seen_urls.add(job['url'])
        
        print(f"✅ Total de empleos únicos extraídos: {len(unique_jobs)}")
        return unique_jobs

    async def get_job_details(self, session: aiohttp.ClientSession, job_url: str) -> Dict:
        """Obtiene los detalles completos de un trabajo específico"""
        html = await self.fetch_page(session, job_url)
        if not html:
            return {}
        
        soup = BeautifulSoup(html, 'html.parser')
        details = {}
        
        try:
            # Buscar descripción del trabajo con selectores más específicos
            description_selectors = [
                'div[class*="job-description"]',
                'div[class*="description"]',
                'div[class*="content"]',
                'section[class*="job"]',
                'article',
                'main .content',
                'div.job-details',
                '.job-posting',
                '.position-details'
            ]
            
            descripcion_encontrada = False
            for selector in description_selectors:
                desc_elements = soup.select(selector)
                for desc_element in desc_elements:
                    if desc_element:
                        text_content = desc_element.get_text(strip=True)
                        if len(text_content) > 100:  # Solo considerar contenido sustancial
                            details['descripcion'] = text_content
                            descripcion_encontrada = True
                            break
                if descripcion_encontrada:
                    break
            
            # Si no encuentra descripción específica, buscar en el contenido principal
            if not descripcion_encontrada:
                # Buscar contenido principal
                main_selectors = ['main', 'article', 'div[role="main"]', '.main-content']
                for selector in main_selectors:
                    main_content = soup.select_one(selector)
                    if main_content:
                        # Remover elementos no deseados
                        for unwanted in main_content.select('nav, header, footer, aside, .navigation, .menu, .breadcrumb, .sidebar'):
                            unwanted.decompose()
                        
                        text_content = main_content.get_text()
                        # Limpiar espacios en blanco excesivos
                        clean_text = re.sub(r'\s+', ' ', text_content).strip()
                        if len(clean_text) > 200:
                            details['descripcion'] = clean_text[:3000]  # Limitar longitud
                            break
            
            # Buscar requisitos específicos
            req_keywords = ['requisitos', 'requirements', 'perfil', 'competencias', 'experiencia', 'conocimientos']
            for keyword in req_keywords:
                # Buscar headers o títulos que contengan estas palabras
                headers = soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'b'])
                for header in headers:
                    if header and keyword.lower() in header.get_text().lower():
                        # Buscar el contenido siguiente
                        next_content = []
                        current = header.next_sibling
                        
                        while current and len(next_content) < 5:  # Máximo 5 elementos siguientes
                            if hasattr(current, 'get_text'):
                                text = current.get_text(strip=True)
                                if text and len(text) > 10:
                                    next_content.append(text)
                            current = current.next_sibling
                        
                        if next_content:
                            details['requisitos'] = ' '.join(next_content)
                            break
                
                if 'requisitos' in details:
                    break
            
            # Buscar información adicional como salario, modalidad, etc.
            additional_info = []
            
            # Buscar palabras clave de modalidad de trabajo
            text_content = soup.get_text().lower()
            if 'remoto' in text_content or 'teletrabajo' in text_content:
                additional_info.append("Modalidad: Remoto/Teletrabajo")
            elif 'presencial' in text_content:
                additional_info.append("Modalidad: Presencial")
            elif 'híbrido' in text_content or 'hibrido' in text_content:
                additional_info.append("Modalidad: Híbrido")
            
            # Buscar información de horario
            horario_patterns = [
                r'horario[:\s]+([^.]+)',
                r'jornada[:\s]+([^.]+)',
                r'turno[:\s]+([^.]+)'
            ]
            
            for pattern in horario_patterns:
                match = re.search(pattern, text_content, re.IGNORECASE)
                if match:
                    additional_info.append(f"Horario: {match.group(1).strip()}")
                    break
            
            if additional_info:
                details['informacion_adicional'] = '; '.join(additional_info)
        
        except Exception as e:
            print(f"⚠️  Error al extraer detalles de {job_url}: {e}")
        
        return details

    async def scrape_all_jobs(self, max_pages: int = 5) -> List[JobOffer]:
        """Scraping completo de todas las ofertas laborales"""
        all_jobs = []
        
        async with aiohttp.ClientSession() as session:
            print("🚀 Iniciando scraping de empleos de Codelco...")
            
            # Obtener primera página
            print(f"📄 Obteniendo página de búsqueda: {self.search_url}")
            html = await self.fetch_page(session, self.search_url)
            
            if not html:
                print("❌ No se pudo obtener la página de búsqueda")
                return []
            
            # Extraer trabajos básicos
            basic_jobs = self.extract_job_links_and_basic_info(html)
            print(f"📋 Encontrados {len(basic_jobs)} empleos")
            
            if not basic_jobs:
                print("❌ No se encontraron empleos en la página")
                return []
            
            # Obtener detalles de cada trabajo
            print("🔍 Obteniendo detalles de cada empleo...")
            
            for i, job_data in enumerate(basic_jobs, 1):
                print(f"   📝 Procesando {i}/{len(basic_jobs)}: {job_data['titulo'][:50]}...")
                
                # Obtener detalles adicionales
                details = await self.get_job_details(session, job_data['url'])
                
                # Crear objeto JobOffer
                job_offer = JobOffer(
                    id_proceso=job_data['id_proceso'],
                    titulo=job_data['titulo'],
                    url=job_data['url'],
                    fecha=job_data['fecha'],
                    region=job_data['region'],
                    codigo_postal=job_data['codigo_postal'],
                    ubicacion=job_data['ubicacion'],
                    descripcion=details.get('descripcion', ''),
                    requisitos=details.get('requisitos', '')
                )
                
                all_jobs.append(job_offer)
                
                # Pequeña pausa para no sobrecargar el servidor
                await asyncio.sleep(1)
        
        print(f"✅ Scraping completado! Total de empleos extraídos: {len(all_jobs)}")
        return all_jobs

    def save_to_json(self, jobs: List[JobOffer], filename: str = None) -> str:
        """Guarda los empleos en un archivo JSON"""
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"empleos_codelco_{timestamp}.json"
        
        # Convertir a diccionarios
        jobs_dict = [
            {
                'id_proceso': job.id_proceso,
                'titulo': job.titulo,
                'url': job.url,
                'fecha': job.fecha,
                'region': job.region,
                'codigo_postal': job.codigo_postal,
                'ubicacion': job.ubicacion,
                'descripcion': job.descripcion,
                'requisitos': job.requisitos,
                'fecha_scraped': job.fecha_scraped
            }
            for job in jobs
        ]
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(jobs_dict, f, ensure_ascii=False, indent=2)
        
        print(f"💾 Datos guardados en: {filename}")
        return filename

    async def save_to_database(self, jobs: List[JobOffer]) -> int:
        """Guarda los empleos en la base de datos"""
        print("💾 Guardando empleos en la base de datos...")
        
        saved_count = 0
        async with get_session() as session:
            for job in jobs:
                try:
                    # Verificar si el empleo ya existe
                    existing_job = await session.exec(
                        select(CodelcoJob).where(CodelcoJob.id_proceso == job.id_proceso)
                    )
                    existing_job = existing_job.first()
                    
                    if existing_job:
                        # Actualizar empleo existente
                        existing_job.titulo = job.titulo
                        existing_job.url = job.url
                        existing_job.fecha = job.fecha
                        existing_job.region = job.region
                        existing_job.codigo_postal = job.codigo_postal
                        existing_job.ubicacion = job.ubicacion
                        existing_job.descripcion = job.descripcion
                        existing_job.requisitos = job.requisitos
                        existing_job.fecha_actualizado = datetime.now()
                        existing_job.activo = True
                        
                        session.add(existing_job)
                        print(f"   🔄 Actualizado: {job.titulo[:50]}...")
                    else:
                        # Crear nuevo empleo
                        db_job = CodelcoJob(
                            id_proceso=job.id_proceso,
                            titulo=job.titulo,
                            url=job.url,
                            fecha=job.fecha,
                            region=job.region,
                            codigo_postal=job.codigo_postal,
                            ubicacion=job.ubicacion,
                            descripcion=job.descripcion,
                            requisitos=job.requisitos,
                            fecha_scraped=datetime.fromisoformat(job.fecha_scraped.replace('Z', '+00:00')) if 'Z' in job.fecha_scraped else datetime.fromisoformat(job.fecha_scraped),
                            activo=True
                        )
                        
                        session.add(db_job)
                        print(f"   ✅ Creado: {job.titulo[:50]}...")
                    
                    saved_count += 1
                    
                except Exception as e:
                    print(f"   ❌ Error guardando {job.titulo}: {e}")
                    continue
            
            await session.commit()
        
        print(f"✅ {saved_count} empleos guardados en la base de datos!")
        return saved_count

    async def scrape_and_save(self, output_file: str = None) -> Dict[str, any]:
        """Método principal que ejecuta el scraping completo y guarda los resultados"""
        jobs = await self.scrape_all_jobs()
        if jobs:
            # Guardar en JSON
            json_file = self.save_to_json(jobs, output_file)
            
            # Guardar en base de datos
            db_count = await self.save_to_database(jobs)
            
            return {
                "json_file": json_file,
                "jobs_count": len(jobs),
                "db_saved_count": db_count,
                "success": True
            }
        
        return {
            "json_file": "",
            "jobs_count": 0,
            "db_saved_count": 0,
            "success": False
        }


# Función principal para ejecutar el scraper
async def main():
    """Función principal para ejecutar el scraper"""
    scraper = CodelcoScraper()
    result = await scraper.scrape_and_save()
    
    if result["success"]:
        print(f"\n🎉 Scraping completado exitosamente!")
        print(f"📁 Archivo JSON: {result['json_file']}")
        print(f"📊 Empleos encontrados: {result['jobs_count']}")
        print(f"💾 Empleos guardados en DB: {result['db_saved_count']}")
        print(f"🌐 Fuente: {scraper.base_url}")
    else:
        print("\n❌ No se pudieron extraer empleos")


if __name__ == "__main__":
    # Ejecutar el scraper
    asyncio.run(main())
