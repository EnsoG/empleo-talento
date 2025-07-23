# Guía de Despliegue - Emplea Talento

## 1. Preparación del Servidor (VPS Debian)

Instalar dependencias básicas:
```bash
apt update && apt upgrade -y
apt install -y python3 python3-pip python3-venv nodejs npm git nginx mariadb-server
```

Instalar pnpm globalmente:
```bash
npm install -g pnpm
```

## 2. Configurar Base de Datos

### Configurar MySQL
```bash
mysql_secure_installation
```

### Crear base de datos
```sql
mysql -u root -p

CREATE DATABASE empleatalento;
CREATE USER 'empleatalento'@'localhost' IDENTIFIED BY 'ET4242Hola_';
GRANT ALL PRIVILEGES ON empleatalento.* TO 'empleatalento'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 3. Clonar y Configurar el Proyecto

```bash
cd /var/www/
git clone https://github.com/cesarom18/empleo-talento.git
cd empleo-talento
```

## 4. Configurar Backend

```bash
cd back-end

# Crear entorno virtual
python3 -m venv venv
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp env_example .env
nano .env
```

Edita el `.env` con estos valores para producción:
```env
# Database Variables
DB_USERNAME='empleatalento'
DB_PASSWORD='tu_password_segura'
DB_HOST='localhost'
DB_NAME='empleatalento'

# SMTP Gmail Service Variables
SMTP_USERNAME='ensitoguidotti@gmail.com'
SMTP_PASSWORD='dqyq zkhv rjtp inaz'
SMTP_MAIL_FROM='ensitoguidotti@gmail.com'

# JWT Variables
JWT_SECRET_KEY='a8F!k2@9zP#1qL$7wX^3eR%6tY*0uI&4oB'

# CORS Variables
FRONT_END_DOMAIN='http://31.97.84.29'
```

```bash
# Crear directorios para archivos estáticos
mkdir -p src/uploads/photos
mkdir -p src/uploads/logos
mkdir -p src/uploads/resumes

# Inicializar base de datos
PYTHONPATH=$(pwd)/src python src/scripts/initialize_db.py
```

## 5. Configurar Frontend

```bash
cd ../front-end

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env_example .env
nano .env
```

Edita el `.env` del frontend:
```env
# Backend Variables
VITE_API_URL='http://31.97.84.29:8000/v1'
VITE_ADMIN_LOGIN_SECRET='aaa'

# Google OAuth Variables    
VITE_GOOGLE_CLIENT_ID=example
```

```bash
# Crear build de producción
pnpm run build
```

## 6. Configurar Nginx

```bash
nano /etc/nginx/sites-available/empleatalento
```

Contenido del archivo:
```nginx
server {
    listen 80;
    server_name 31.97.84.29;

    # Frontend
    location / {
        root /var/www/empleo-talento/front-end/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /v1/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Archivos estáticos del backend
    location /uploads/ {
        alias /var/www/empleo-talento/back-end/src/uploads/;
    }
}
```

```bash
# Activar sitio
ln -s /etc/nginx/sites-available/empleatalento /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

## 7. Configurar Servicios Systemd

### Servicio para el Backend:
```bash
nano /etc/systemd/system/empleatalento-backend.service
```

Contenido:
```ini
[Unit]
Description=Emplea Talento Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/empleo-talento/back-end
Environment=PATH=/var/www/empleo-talento/back-end/venv/bin
ExecStart=/var/www/empleo-talento/back-end/venv/bin/fastapi run src/main.py --host 127.0.0.1 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Dar permisos y activar servicio
chown -R www-data:www-data /var/www/empleo-talento/
systemctl daemon-reload
systemctl enable empleatalento-backend
systemctl start empleatalento-backend
```

## 8. Verificar el Funcionamiento

```bash
# Verificar servicios
systemctl status nginx
systemctl status empleatalento-backend

# Verificar logs si hay problemas
journalctl -u empleatalento-backend -f
```

## 9. Acceder a la Aplicación

Abre tu navegador y ve a: http://31.97.84.29

## Comandos Útiles para Mantenimiento

```bash
# Reiniciar servicios
systemctl restart empleatalento-backend
systemctl restart nginx

# Ver logs
journalctl -u empleatalento-backend -f
tail -f /var/log/nginx/error.log

# Actualizar código
cd /var/www/empleo-talento
git pull
# Luego rebuildar frontend si es necesario
cd front-end && pnpm run build
systemctl restart empleatalento-backend
```

# si no tiene certificado ssd
```
response.delete_cookie(
    key="access_token",
    httponly=True,
    secure=True,
    samesite="none"
) 
```
# Cámbiala por:
```
pythonresponse.delete_cookie(
    key="access_token",
    httponly=True,
    secure=False,
    samesite="lax"
)
```