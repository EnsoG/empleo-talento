# 🏭 Scraper de Empleos de Codelco

Este scraper extrae automáticamente las ofertas laborales del sitio oficial de empleos de Codelco (https://empleos.codelco.cl/search/) y las integra con el sistema de gestión de empleos.

## ✨ Características

- ✅ **Extracción completa**: Título, fecha, región, código postal, descripción y requisitos
- ✅ **Detección inteligente**: Maneja la estructura dinámica del sitio web
- ✅ **Eliminación de duplicados**: Evita ofertas repetidas automáticamente
- ✅ **Formato JSON**: Guarda los datos en formato estándar
- ✅ **Integración API**: Endpoints REST para uso programático
- ✅ **Base de datos**: Guarda directamente en la BD del proyecto
- ✅ **Manejo de errores**: Robusto ante cambios en el sitio web

## 📊 Datos Extraídos

Cada oferta laboral incluye:

- **ID de proceso**: Identificador único de Codelco
- **Título**: Nombre del puesto
- **Fecha**: Fecha de publicación
- **Región**: Ubicación geográfica (ej: "2da.Reg.Antofagasta")
- **Código postal**: Código postal de la ubicación
- **URL**: Enlace directo a la oferta
- **Descripción**: Descripción completa del puesto
- **Requisitos**: Requisitos específicos del cargo
- **Información adicional**: Horarios, modalidad de trabajo, etc.

## 🚀 Formas de Uso

### 1. Script Directo (Recomendado para primera vez)

```bash
# Ejecutar scraper completo
python src/scripts/run_codelco_scraper.py

# Modo de prueba
python src/scripts/test_scraper.py

# Demo interactivo
python src/scripts/demo_scraper.py
```

### 2. Integración con Base de Datos

```bash
# Scraping + guardado en BD automático
python src/scripts/scrape_and_save_codelco.py
```

### 3. API REST (Cuando el backend esté reiniciado)

```bash
# Probar funcionamiento
curl http://localhost:8000/v1/scrapers/codelco/test

# Ejecutar scraping completo
curl -X POST http://localhost:8000/v1/scrapers/codelco/run

# Ver empleos guardados
curl http://localhost:8000/v1/scrapers/codelco/jobs

# Estado general
curl http://localhost:8000/v1/scrapers/status
```

### 4. Uso Programático

```python
from scrapers.codelco_scraper import CodelcoScraper

# Crear instancia
scraper = CodelcoScraper()

# Ejecutar scraping
jobs = await scraper.scrape_all_jobs()

# Guardar en JSON
filename = scraper.save_to_json(jobs)

print(f"Extraídos {len(jobs)} empleos en {filename}")
```

## 📁 Archivos Generados

- `empleos_codelco_YYYYMMDD_HHMMSS.json`: Datos completos de empleos
- `debug_codelco.html`: HTML de la página (para debugging)

## 🔧 Configuración Técnica

### Dependencias Instaladas
- `aiohttp`: Para requests HTTP asíncronos
- `beautifulsoup4`: Para parsing HTML
- `lxml`: Parser XML/HTML optimizado

### Características Técnicas
- **User-Agent**: Configurado para evitar bloqueos
- **Selectores CSS**: Extracción robusta usando IDs específicos
- **Async/Await**: Operaciones no bloqueantes
- **Rate limiting**: Pausas entre requests para no sobrecargar el servidor
- **Error handling**: Manejo de errores y logging detallado

## 📈 Resultados del Último Scraping

```
🎉 ¡Scraping completado exitosamente!
📊 Total empleos encontrados: 18
📁 Archivo generado: empleos_codelco_20250822_171724.json
🌐 Fuente: https://empleos.codelco.cl

📋 Empleos por región:
   2da.Reg.Antofagasta: 11 empleos
   3ra.Reg.Atacama: 2 empleos
   5ta.Reg.Valparaíso: 2 empleos
   6ta.Reg.O'higgins: 2 empleos
   Reg. Metropolitana: 1 empleo
```

## 🔄 Reiniciar Backend con Nuevos Endpoints

Para usar los endpoints API, reinicia el servidor FastAPI:

```bash
# Detener el servidor actual (Ctrl+C)
# Luego reiniciar:
cd back-end
fastapi dev src/main.py
```

## 🛠️ Solución de Problemas

### Error de conexión
- Verificar conexión a internet
- El sitio de Codelco puede estar temporalmente inaccesible

### No encuentra empleos
- El sitio puede haber cambiado su estructura
- Revisar el archivo `debug_codelco.html` para análisis

### Error de importación
- Verificar que `PYTHONPATH` esté configurado:
  ```bash
  $env:PYTHONPATH = (Get-Location).Path + "\\src"
  ```

## 📊 Integración con el Proyecto

El scraper está completamente integrado con el sistema de empleos:

1. **Modelo de datos**: Compatible con `JobOffer` del proyecto
2. **Base de datos**: Guarda directamente en MySQL
3. **API REST**: Endpoints bajo `/v1/scrapers/`
4. **Frontend**: Los empleos aparecerán en la interfaz web

## 🔮 Próximas Mejoras

- [ ] Scraping de más sitios de empleo
- [ ] Detección automática de nuevas ofertas
- [ ] Notificaciones por email de nuevos empleos
- [ ] Filtros automáticos por área/región
- [ ] Dashboard de estadísticas de scraping

## 📞 Soporte

Si encuentras problemas:

1. Revisar logs en terminal
2. Verificar archivo `debug_codelco.html`
3. Probar con `test_scraper.py` primero
4. Verificar conexión al sitio web de Codelco

---

**🎯 El scraper está listo y funcionando perfectamente!** 

Puedes empezar a usarlo inmediatamente con cualquiera de los métodos descritos arriba.
