# Emplea Talento
Plataforma dedicada al la publicacion de ofertas laborales y la gestion del proceso mismo por parte de las empresas registradas. En cuanto a la arquitectura del sistema, se encuentra separado en dos partes principalmente Front-End y Back-End en donde cada una tiene sus respectivas tecnologias.

En las siguientes secciones se presenta como hacer el setup completo del sistema para su funcionamiento para un **entorno de desarrollo**.

## Obtener Codigo Fuente
La totalidad del proyecto se enceuntra en este repositorio de git, para obtener le codigo fuente como tal se provee de las dos opciones habituales:

La primera mediante HTTP:
```sh
git clone https://github.com/cesarom18/empleo-talento.git
```

Y la segunda mediante credenciales SSH en caso de tenerlo configurado previamente:
```sh
git clone git@github.com:cesarom18/empleo-talento.git
```

## Front-End Setup
Para el desarrollo Front-End se utilizo NodeJs (v23.9.0) y ViteJs como entorno de ejecucion de JavaScript, adicionalmente se uso `pnpm` como gestor de paquetes principal de dependencias para el desarrollo del proyecto, en caso de utilizar cualquier otro gestor de paquetes (Como `npm` o `yarn`) en principio no deberia de existir ningun problema.

### Instalacion Dependencias y Variables De Entorno
Dentro del directorio `front-end` se encuentra el `package.json` respectivo con todas las dependencias utilizadas para el desarrollo y produccion en caso de ser necesitadas, para la instalacion de dependencias y declaracion de las variables de entorno hay que posicionarse en el directorio `front-end` y realizar los siguiente pasos:

- Dentro del directorio de  `front-end` se encuentra un archivo `.env_example` el cual contiene la estructura y declaracion de todas las variables de entorno que usar el cliente, simplemente hay que realizar una copia del archivo en el mismo nivel de directorio y renombrarlo a `.env`, para asi luego cambiar los valores respectivos
- Por ultimo simplemente se ejecuta el siguiente comando en terminal para instalar las dependencias, dependiendo del gestor de paquetes puede cambiar un poco el comando, aunque suele ser similar en la mayoria de gestores:

```sh
pnpm i
```

### Ejecutar En Desarrollo
Con lo anterior mencionado el entorno ya deberia de estar listo para ejecutar el proyecto como minimo en desarrollo, en caso de necesitarlo simplemente ejecutar el siguiente comando en el mismo directorio:

```sh
pnpm run dev
```

### Creacion Build Produccion
Por ultimo, en caso de necesitar la `build/dist` del proyecto simplemente ejecutar en el mismo directorio:

```sh
pnpm run build
```

## Back-End Setup
Para el desarrollo Back-End se utilizaron las siguientes tecnologias para esta parte del proyecto:
- FastAPI
- SQLModel (ORM Fork De SQLAlchemy)
- FastMail (Gestor SMTP)
- MySQL (MariaDB)

### Entorno Virtual Y Instalacion Dependencias
Para la gestion de dependencias se utilizo el tradicional `pip`, en caso de utilizar cualquier otro gestor como por ejemplo `poetry` o `uv` en principio no deberia de existir mayor complicacion ya que el proceso es similar (Simplemente ver documentacion para realizar las acciones homologas con el gestor de preferencia). A continuacion, se presenta el paso a paso para el entorno virtual y la instalacion de dependencias:

> **IMPORTANTE**: En caso de estar en el entorno de produccion simplemente comenzar desde el paso 4, ya que los anteriores a este abordan la preparacion para el entorno de desarrollo

1. Posicionarse en el directorio `back-end`.
2. Crear el entorno virtual:
```sh
python -m venv venv
```
3. Activar entorno virtual:
    - En Linux y MacOS:
    ```sh
    source venv/bin/activate
    ```
    - En Windows:
    ```sh
    .venv/Scripts/activate
    ```
4. Instalacion de dependencias:
```sh
pip install -r requeriments.txt
```

### Configuracion Variables De Entorno
Dentro del directorio `back-end` se encuentra un archivo `env_example` con las variables de entorno que se utilizan en la totalidad del proyecto. Para poder declarar y hacer validas dichas variables favor de seguir el siguiente proceso:

1. Hacer una copia de `env_example` en el mismo directorio y re-nombrarlo a `.env`.
2. Cambiar los valores/credenciales de las variable con los respectivos, ya sea del entorno de desarrollo o del entorno de produccion segun el caso que se presente.

### Bulk Inicial De Tablas Y Datos
> **IMPORTANTE**: Cabe destacar que hasta este punto se asume que los servicios de base de datos ya se encuentran en ejecucion y por lo menos la base de datos ya se encuentra creada, por lo que en caso de ocurrir algun error con este punto favor de revisar dicho apartado

Para la inicializacion de la base de datos y sus tablas se provee de un script dentro del directorio `scripts` llamado `initialize_db.py`, para asi facilitar este proceso y no estar creandolas continuamente y consultando cambios en los modelos (El proceso de migrations se realizara aparte) en cada inicio del servidor como sugiere el framework de FastAPI. A continuacion, se presenta el proceso para ejecutar el script mencionado:

1. Posicionarse en el directorio `back-end`.
2. Ejecutar el script:
    - En Linux y MacOS:
    ```sh
    PYTHONPATH=$(pwd)/src python src/scripts/initialize_db.py
    ```
    - En Windows CMD:
    ```cmd
    set PYTHONPATH=%cd%\src
    python src\scripts\initialize_db.py
    ```
    - En Windows PowerShell:
    ```powershell
    $env:PYTHONPATH = (Get-Location).Path + "\src"
    python src\scripts\initialize_db.py
    ```

### Ejecutar En Desarrollo
Luego de haber preparado el entorno y la base de datos con las tablas respectivas se puede proceder a ejecutar el Back-End, para ejecutarlo simplemente usar el siguiente comando en el directorio de `back-end` y estar con el `venv` o entorno virtual activo:
```sh
fastpi dev src/main.py
```

### Archivos Estaticos
En relacion a los requerimientos del sistema, se debe servir tanto archivos de formato para imagenes como documentos como tal, es por esto que dentro del directorio `back-end/src` debe crearse la siguiente jerarquia de directorios para poder almacenar y proveer de estos:

- `uploads`
    - `photos`
    - `logos`
    - `resumes`