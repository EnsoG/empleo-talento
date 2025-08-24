"""
Debug script para analizar la estructura HTML del sitio de Codelco
"""

import asyncio
import aiohttp
from bs4 import BeautifulSoup
import re


async def debug_html_structure():
    """Analizar la estructura HTML del sitio"""
    print("🔍 ANALIZANDO ESTRUCTURA HTML DE CODELCO")
    print("=" * 60)
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive'
    }
    
    url = "https://empleos.codelco.cl/search/"
    
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(url, headers=headers) as response:
                html = await response.text()
                
                print(f"📄 Página obtenida exitosamente ({len(html)} caracteres)")
                
                # Guardar HTML para análisis
                with open("debug_codelco.html", "w", encoding="utf-8") as f:
                    f.write(html)
                print("💾 HTML guardado en debug_codelco.html")
                
                soup = BeautifulSoup(html, 'html.parser')
                
                # Analizar enlaces con /job/
                job_links = soup.find_all('a', href=re.compile(r'/job/'))
                print(f"\n🔗 Encontrados {len(job_links)} enlaces con '/job/'")
                
                if job_links:
                    print("\n📋 PRIMEROS 3 ENLACES:")
                    for i, link in enumerate(job_links[:3], 1):
                        print(f"\n{i}. Título: {link.get_text(strip=True)}")
                        print(f"   URL: {link.get('href')}")
                        
                        # Analizar el contenedor padre
                        parent = link.find_parent()
                        level = 1
                        while parent and level <= 10:
                            text = parent.get_text()
                            if 'ID de proceso' in text:
                                print(f"   📦 Contenedor encontrado en nivel {level}")
                                print(f"   📝 Contenido del contenedor:")
                                # Extraer líneas relevantes
                                lines = [line.strip() for line in text.split('\n') if line.strip()]
                                for line in lines[:10]:  # Primeras 10 líneas
                                    if any(keyword in line for keyword in ['ID de proceso', 'Fecha', 'Región', 'Código']):
                                        print(f"      {line}")
                                break
                            parent = parent.find_parent()
                            level += 1
                        
                        if level > 10:
                            print("   ❌ No se encontró contenedor con información")
                
                # Buscar patrones específicos en el HTML
                print(f"\n🔍 BUSCANDO PATRONES EN EL HTML:")
                
                # Buscar IDs de proceso
                id_matches = re.findall(r'ID de proceso (\d+)', html)
                print(f"📊 IDs de proceso encontrados: {len(id_matches)}")
                if id_matches:
                    print(f"   Ejemplos: {id_matches[:5]}")
                
                # Buscar fechas
                fecha_matches = re.findall(r'Fecha (\d{1,2} \w+ \d{4})', html)
                print(f"📅 Fechas encontradas: {len(fecha_matches)}")
                if fecha_matches:
                    print(f"   Ejemplos: {fecha_matches[:5]}")
                
                # Buscar regiones
                region_matches = re.findall(r'Región ([^C\n]+?)(?=Código|$)', html)
                print(f"🌍 Regiones encontradas: {len(region_matches)}")
                if region_matches:
                    print(f"   Ejemplos: {region_matches[:5]}")
                
                # Analizar la estructura de las secciones de empleos
                print(f"\n🏗️  ANALIZANDO ESTRUCTURA DE SECCIONES:")
                
                # Buscar elementos que contengan información de empleos
                job_sections = soup.find_all(string=re.compile(r'ID de proceso'))
                print(f"📄 Secciones con 'ID de proceso': {len(job_sections)}")
                
                if job_sections:
                    for i, section in enumerate(job_sections[:3], 1):
                        parent = section.find_parent()
                        if parent:
                            print(f"\n{i}. Sección #{i}:")
                            print(f"   Tag: {parent.name}")
                            print(f"   Clases: {parent.get('class', [])}")
                            text_content = parent.get_text()
                            # Mostrar líneas relevantes
                            lines = [line.strip() for line in text_content.split('\n') if line.strip()]
                            for line in lines[:8]:
                                if line:
                                    print(f"   {line}")
                
        except Exception as e:
            print(f"❌ Error: {e}")
            import traceback
            traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(debug_html_structure())
