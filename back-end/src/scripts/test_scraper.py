"""
Script de prueba simple para el scraper de Codelco
"""

import asyncio
import sys
import os

# Agregar el directorio padre al path para importar el scraper
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scrapers.codelco_scraper import CodelcoScraper


async def test_scraper():
    """Prueba básica del scraper"""
    print("🧪 PRUEBA DEL SCRAPER DE CODELCO")
    print("=" * 50)
    
    scraper = CodelcoScraper()
    
    try:
        print("📡 Testeando conexión al sitio web...")
        
        # Crear una sesión para hacer la prueba
        import aiohttp
        async with aiohttp.ClientSession() as session:
            # Test 1: Verificar que se puede acceder a la página principal
            html = await scraper.fetch_page(session, scraper.search_url)
            if html:
                print("✅ Conexión exitosa al sitio web")
                print(f"📄 Tamaño de la página: {len(html)} caracteres")
                
                # Test 2: Extraer empleos básicos
                print("\n🔍 Extrayendo empleos de la página...")
                jobs = scraper.extract_job_links_and_basic_info(html)
                
                if jobs:
                    print(f"✅ Se encontraron {len(jobs)} empleos")
                    
                    # Mostrar los primeros 3 empleos
                    print("\n📋 PRIMEROS EMPLEOS ENCONTRADOS:")
                    print("-" * 40)
                    for i, job in enumerate(jobs[:3], 1):
                        print(f"\n{i}. {job['titulo']}")
                        print(f"   🆔 ID: {job['id_proceso']}")
                        print(f"   📅 Fecha: {job['fecha']}")
                        print(f"   📍 Región: {job['region']}")
                        print(f"   📮 Código postal: {job['codigo_postal']}")
                        print(f"   🔗 URL: {job['url']}")
                    
                    # Test 3: Probar extracción de detalles en el primer empleo
                    if jobs:
                        print(f"\n🔍 Probando extracción de detalles del primer empleo...")
                        first_job = jobs[0]
                        details = await scraper.get_job_details(session, first_job['url'])
                        
                        if details:
                            print("✅ Detalles extraídos exitosamente")
                            if 'descripcion' in details:
                                desc_preview = details['descripcion'][:200] + "..." if len(details['descripcion']) > 200 else details['descripcion']
                                print(f"📝 Descripción: {desc_preview}")
                            if 'requisitos' in details:
                                req_preview = details['requisitos'][:200] + "..." if len(details['requisitos']) > 200 else details['requisitos']
                                print(f"📋 Requisitos: {req_preview}")
                            if 'informacion_adicional' in details:
                                print(f"ℹ️  Info adicional: {details['informacion_adicional']}")
                        else:
                            print("⚠️  No se pudieron extraer detalles adicionales")
                    
                    print("\n🎉 ¡Prueba completada exitosamente!")
                    return True
                else:
                    print("❌ No se pudieron extraer empleos de la página")
                    return False
            else:
                print("❌ No se pudo acceder al sitio web")
                return False
                
    except Exception as e:
        print(f"❌ Error durante la prueba: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = asyncio.run(test_scraper())
    if success:
        print("\n✅ El scraper está funcionando correctamente")
    else:
        print("\n❌ El scraper tiene problemas")
