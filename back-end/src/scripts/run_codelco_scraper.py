"""
Script para ejecutar el scraper de Codelco
"""

import asyncio
import sys
import os

# Agregar el directorio padre al path para importar el scraper
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scrapers.codelco_scraper import CodelcoScraper


async def run_scraper():
    """Ejecuta el scraper de Codelco"""
    print("=" * 60)
    print("🏭 SCRAPER DE EMPLEOS DE CODELCO")
    print("=" * 60)
    
    scraper = CodelcoScraper()
    
    try:
        # Ejecutar scraping
        jobs = await scraper.scrape_all_jobs()
        
        if jobs:
            # Guardar resultados
            filename = scraper.save_to_json(jobs)
            
            print("\n📊 RESUMEN DE RESULTADOS:")
            print("-" * 30)
            print(f"Total de empleos encontrados: {len(jobs)}")
            print(f"Archivo generado: {filename}")
            
            # Mostrar algunos ejemplos
            print("\n📋 PRIMEROS 3 EMPLEOS ENCONTRADOS:")
            print("-" * 40)
            for i, job in enumerate(jobs[:3], 1):
                print(f"\n{i}. {job.titulo}")
                print(f"   🆔 ID: {job.id_proceso}")
                print(f"   📅 Fecha: {job.fecha}")
                print(f"   📍 Ubicación: {job.ubicacion}")
                print(f"   🔗 URL: {job.url}")
                if job.descripcion:
                    desc_preview = job.descripcion[:100] + "..." if len(job.descripcion) > 100 else job.descripcion
                    print(f"   📝 Descripción: {desc_preview}")
            
            print(f"\n✅ ¡Scraping completado exitosamente!")
            print(f"💾 Datos guardados en: {filename}")
            
        else:
            print("❌ No se encontraron empleos")
            
    except Exception as e:
        print(f"❌ Error durante el scraping: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    # Ejecutar el scraper
    asyncio.run(run_scraper())
