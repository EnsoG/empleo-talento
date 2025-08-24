"""
Guía de uso del scraper de Codelco
"""

import asyncio
from scrapers.codelco_scraper import CodelcoScraper


async def demo_scraper():
    """Demostración del uso del scraper"""
    print("🎯 GUÍA DE USO DEL SCRAPER DE CODELCO")
    print("=" * 60)
    
    print("\n📋 OPCIONES DISPONIBLES:")
    print("1. Ejecutar scraper completo")
    print("2. Solo prueba de conexión")
    print("3. Ver empleos guardados")
    print("4. Salir")
    
    while True:
        try:
            opcion = input("\n👉 Selecciona una opción (1-4): ").strip()
            
            if opcion == "1":
                print("\n🚀 Ejecutando scraper completo...")
                scraper = CodelcoScraper()
                
                # Ejecutar scraping completo
                jobs = await scraper.scrape_all_jobs()
                
                if jobs:
                    # Guardar resultados
                    filename = scraper.save_to_json(jobs)
                    
                    print(f"\n✅ ¡Scraping completado!")
                    print(f"📊 Total de empleos: {len(jobs)}")
                    print(f"📁 Archivo guardado: {filename}")
                    
                    # Mostrar resumen por región
                    regiones = {}
                    for job in jobs:
                        region = job.region
                        if region in regiones:
                            regiones[region] += 1
                        else:
                            regiones[region] = 1
                    
                    print(f"\n📍 EMPLEOS POR REGIÓN:")
                    for region, count in regiones.items():
                        print(f"   {region}: {count} empleos")
                else:
                    print("❌ No se encontraron empleos")
                    
            elif opcion == "2":
                print("\n🧪 Probando conexión...")
                scraper = CodelcoScraper()
                
                import aiohttp
                async with aiohttp.ClientSession() as session:
                    html = await scraper.fetch_page(session, scraper.search_url)
                    
                    if html:
                        jobs = scraper.extract_job_links_and_basic_info(html)
                        print(f"✅ Conexión exitosa")
                        print(f"📄 Tamaño de página: {len(html)} caracteres")
                        print(f"📋 Empleos encontrados: {len(jobs)}")
                        
                        if jobs:
                            print(f"\n🔸 Primer empleo encontrado:")
                            first_job = jobs[0]
                            print(f"   Título: {first_job['titulo']}")
                            print(f"   ID: {first_job['id_proceso']}")
                            print(f"   Fecha: {first_job['fecha']}")
                            print(f"   Región: {first_job['region']}")
                    else:
                        print("❌ Error de conexión")
                        
            elif opcion == "3":
                print("\n📁 Buscando archivos de empleos guardados...")
                import os
                import glob
                
                # Buscar archivos JSON de empleos
                json_files = glob.glob("empleos_codelco_*.json")
                
                if json_files:
                    # Mostrar el archivo más reciente
                    latest_file = max(json_files, key=os.path.getctime)
                    print(f"📂 Archivo más reciente: {latest_file}")
                    
                    # Leer y mostrar resumen
                    import json
                    with open(latest_file, 'r', encoding='utf-8') as f:
                        jobs_data = json.load(f)
                    
                    print(f"📊 Total de empleos en archivo: {len(jobs_data)}")
                    
                    if jobs_data:
                        print(f"\n📋 ÚLTIMOS 3 EMPLEOS:")
                        for i, job in enumerate(jobs_data[:3], 1):
                            print(f"\n{i}. {job['titulo']}")
                            print(f"   ID: {job['id_proceso']}")
                            print(f"   Fecha: {job['fecha']}")
                            print(f"   Región: {job['region']}")
                            print(f"   URL: {job['url']}")
                else:
                    print("📂 No se encontraron archivos de empleos guardados")
                    print("💡 Ejecuta la opción 1 para crear un archivo de empleos")
                    
            elif opcion == "4":
                print("\n👋 ¡Hasta luego!")
                break
                
            else:
                print("❌ Opción no válida. Selecciona 1, 2, 3 o 4.")
                
        except KeyboardInterrupt:
            print("\n\n👋 ¡Hasta luego!")
            break
        except Exception as e:
            print(f"❌ Error: {e}")


def show_usage_info():
    """Muestra información de uso del scraper"""
    print("📚 INFORMACIÓN DEL SCRAPER DE CODELCO")
    print("=" * 50)
    
    print("\n🎯 FUNCIONALIDADES:")
    print("• Extrae ofertas laborales de https://empleos.codelco.cl/search/")
    print("• Obtiene título, fecha, región, código postal y detalles")
    print("• Guarda resultados en formato JSON")
    print("• Maneja duplicados automáticamente")
    print("• Incluye información adicional como horarios")
    
    print("\n🔧 FORMAS DE USO:")
    print("1. Script interactivo: python src/scripts/demo_scraper.py")
    print("2. Scraper directo: python src/scripts/run_codelco_scraper.py")
    print("3. API endpoints: /v1/scrapers/codelco/*")
    print("4. Integración BD: python src/scripts/scrape_and_save_codelco.py")
    
    print("\n📊 ENDPOINTS API DISPONIBLES:")
    print("• GET /v1/scrapers/codelco/test - Prueba el scraper")
    print("• POST /v1/scrapers/codelco/run - Ejecuta scraping completo")
    print("• GET /v1/scrapers/codelco/jobs - Lista empleos guardados")
    print("• GET /v1/scrapers/status - Estado de scrapers")
    
    print("\n💾 ARCHIVOS GENERADOS:")
    print("• empleos_codelco_YYYYMMDD_HHMMSS.json - Datos completos")
    print("• debug_codelco.html - HTML de la página (para debugging)")
    
    print("\n⚙️  CONFIGURACIÓN:")
    print("• User-Agent configurado para evitar bloqueos")
    print("• Pausas entre requests para no sobrecargar el servidor")
    print("• Manejo de errores y reintentos")
    print("• Extracción robusta usando selectores CSS específicos")


if __name__ == "__main__":
    print("🤖 SCRAPER DE EMPLEOS DE CODELCO")
    print("=" * 40)
    
    print("\n¿Qué quieres hacer?")
    print("1. Ver información del scraper")
    print("2. Usar el scraper (modo interactivo)")
    
    try:
        choice = input("\nSelecciona 1 o 2: ").strip()
        
        if choice == "1":
            show_usage_info()
        elif choice == "2":
            asyncio.run(demo_scraper())
        else:
            print("❌ Opción no válida")
            
    except KeyboardInterrupt:
        print("\n👋 ¡Hasta luego!")
    except Exception as e:
        print(f"❌ Error: {e}")
