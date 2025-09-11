# MyCoach API

## Descripción general
### Propósito
MyCoach es una aplicación de gestión de clientes para entrenadores personales. Se utiliza como herramienta para realizar de manera eficiente y organizada controles a los clientes, ya que, el entrenador puede designar rutinas de entrenamiento, dietas, y llevar nota de la evolución del proceso de cada uno de sus clientes.
Además, permite visualizar de manera clara la evolución de los ingresos por suscripciones, cobros realizados y pagos pendientes. Es decir, brinda una organización a nivel financiero también.
Al centralizar todas estas funciones, MyCoach no solo ahorra tiempo, sino que también potencia la calidad del servicio y fortalece la relación entre entrenador y cliente.

### Tecnologías
Se han empleado tecnologías y frameworks como:
- FastAPI para el armado del API REST.
- FastAPI-Mail para enviar correos.
- SQLAlchemy para el armado de modelos SQL.
- Pydantic para la validación de los modelos con schemas.
- JWT y Passlib para la generación de tokens y cifrado de contraseñas.

### Arquitectura de carpetas y módulos
- /api
    * /auth       -> Modelos, schemas y endpoints para la gestión del sistema de autenticación.
    * /core       -> Configuración base, seguridad y dependencias
    * /db         -> Conexión a la base de datos
    * /models     -> Modelos SQL
    * /routers    -> Endpoints generales de la aplicación
    * /schemas    -> Validación de datos con Pydantic
    * main.py     -> Punto de entrada de la API

## Configuración e instalación

### Base de datos
Como primer paso, se debe contar con una base de datos idéntica a la utilizada en el desarrollo, con la siguiente estructura:
- Todas las tablas: usuario, rol, plan, plan_periodo, rutina, rutina_ejercicio, ejercicio, alimento, dieta, dieta_comida, dieta_comida_alimento, cliente, cliente_plan, cliente_rutina, pesaje.
    * **usuario**
        + id -> pk
        + username -> text
        + email -> text
        + hashed_password -> text
        + rol_id -> int fk
    * **rol**
        + id -> pk
        + nombre -> text
    * **plan**
        + id -> pk
        + nombre -> text
        + precio -> numeric
        + periodo_id -> int fk
    * **plan_periodo**
        + id -> pk
        + periodo -> text
    * **rutina**
        + id -> pk
        + nombre -> text
        + plan_id -> int fk
        + es_personalizada -> bool
    * **rutina_ejercicio**
        + id -> pk
        + rutina_id -> int fk
        + ejercicio_id -> int fk
        + dia -> text
        + series -> int
        + repeticiones -> int
        + rir -> int
    * **ejercicio**
        + id -> pk
        + nombre -> text
        + grupo_muscular -> text
    * **alimento**
        + id -> pk
        + nombre -> text
        + calorias_100g -> numeric
        + proteinas -> numeric
        + grasas -> numeric
        + carbohidratos -> numeric
    * **dieta**
        + id -> pk
        + nombre -> text
        + plan_id -> int fk
        + descripcion -> text
    * **dieta_comida**
        + id -> pk
        + dieta_id -> int fk
        + nombre -> text
        + orden -> int
    * **dieta_comida_alimento**
        + id -> pk
        + dieta_comida_id -> int fk
        + alimento_id -> int fk
        + cantidad_g -> numeric
    * **cliente**
        + id -> pk
        + nombre -> text
        + apellido -> text
        + edad -> numeric
        + sexo -> text
        + usuario_id -> int fk
    * **cliente_dieta**
        + id -> pk
        + cliente_id -> int fk
        + dieta_id -> int fk
        + fecha_asignacion -> date
    * **cliente_rutina**
        + id -> pk
        + cliente_id -> int fk
        + rutina_id -> int fk
        + fecha_asignacion -> date
    * **cliente_plan**
        + id -> pk
        + cliente_id -> int fk
        + plan_id -> int fk
        + fecha_inicio -> date
        + fecha_fin -> date
        + activo -> bool

La estructura de la base de datos **NO debe ser alterada**, de lo contrario no está garantizada la compatiblidad con la API.

### Dependencias
Para instalar todas las dependencias, se deben ejecutar las siguientes líneas de comandos:
`pip install -r requirements.txt`

### Variables de entorno
La API solo requiere de dos variables de entorno:
- `DATABASE_URL` para vincular la base de datos
- `SECRET_KEY` para JWT

### Inicialización
Se deben ejecutar los siguientes comandos en el directorio del proyecto (fuera de la carpeta api):
`source venv/Scripts/activate`
`uvicorn api.main:app --reload`
Una vez ejecutados, la API ya estará corriendo de manera local.

## Autenticación y autorización

### Registro
Debe registrar una cuenta mediante el endpoint de **registro** de la siguiente manera:
Este solicitará un JSON (objeto) con los siguientes valores: **usuario**, **email** y **contraseña**.
Ejemplo:
`
{
    "username" : "user", 
    "email" : "user@example.com",
    "password" : "pass"
}
`
Al finalizar, se obtendrá como respuesta un **token** que sirve como llave para tener acceso a todas las funciones de la API.

#### Login
Debe iniciar sesión en una cuenta existente mediante el endpoint de **logueo** de la siguiente manera:
Este solicitará un JSON (objeto) con los siguientes valores: **usuario**, **contraseña**.
Ejemplo:
`
{
    "username" : "user",
    "password" : "pass"
}
`
Al finalizar, al igual que en el registro, se obtendrá como respuesta un **token** que sirve como llave para tener acceso a todas las funciones de la API.

### Autorización
La gran mayoría de endpoints y rutas de la aplicación solicitan un **token** para verificar los permisos del usuario y conceder o no el acceso.
Sencillamente, se solicita un JSON (objeto) con los siguientes valores: **token**.
Ejemplo:
`
"data" : {
    "token" : "e32f6uidyg74sghfaa"
}
`
Este token, es un **identificador único** con el que se puede comprobar de qué usuario se trata y si ese usuario tiene el rol adecuado para realizar esa función.

## Endpoints de la API

### Auth
- /auth/login
    * Ruta POST para iniciar sesión.
- /auth/registro
    * Ruta POST para registrar una cuenta.
- /auth/usuario/{usuario_id}
    * Ruta POST para obtener los datos de un usuario. **Requiere permisos**
- /auth/perfil
    * Ruta POST para ver el perfil del usuario actual. **Requiere permisos**
- /auth/forgot-password
    * Ruta POST para enviar un mail y cambiar la contraseña olvidada.
- /auth/reset-password
    * Ruta POST para cambiar la contraseña, a partir de un token recibido por mail.

### Clientes
- /api/clientes/crear
    * Ruta POST para crear el cliente.
- /api/clientes/
    * Ruta GET para ver la lista de clientes. **Requiere permisos**.
- /api/clientes/{cliente_id}
    * Ruta GET para buscar un cliente específico.
- /api/clientes/userID/{usuario_id}
    * Ruta GET para buscar un cliente vinculado al ID de un usuario específico.
- /api/clientes/{cliente_id}
    * Ruta PUT para actualizar los datos de un cliente. **Requiere permisos**.
- /api/clientes/{cliente_id}
    * Ruta DELETE para eliminar un cliente. **Requiere permisos**.
- /api/clientes/cliente_rutina/{cliente_id}
    * Ruta GET para obtener la rutina de un cliente.
- /api/clientes/cliente_rutina/asignar
    * Ruta POST para asignar una rutina a un cliente. **Requiere permisos**.
- /api/clientes/cliente_rutina/{cliente_id}
    * Ruta PUT para re-asignar una rutina a un cliente. **Requiere permisos**. 
- /api/clientes/cliente_rutina/{cliente_id}
    * Ruta DELETE para quitar la asignación de rutina de un cliente. **Requiere permisos**.
- /api/clientes/cliente_dieta/{cliente_id}
    * Ruta GET para obtener la dieta de un cliente.
- /api/clientes/cliente_dieta/asignar
    * Ruta POST para asignar una dieta a un cliente. **Requiere permisos**.
- /api/clientes/cliente_dieta/{cliente_id}
    * Ruta PUT para re-asignar una dieta a un cliente. **Requiere permisos**. 
- /api/clientes/cliente_dieta/{cliente_id}
    * Ruta DELETE para quitar la asignación de dieta de un cliente. **Requiere permisos**.
- /api/clientes/cliente_plan/{cliente_id}
    * Ruta GET para obtener el plan de un cliente.
- /api/clientes/cliente_plan/asignar
    * Ruta POST para asignar el plan a un cliente. **Requiere permisos**.
- /api/clientes/cliente_plan/{cliente_id}
    * Ruta PUT para re-asignar el plan a un cliente. **Requiere permisos**.
- /api/clientes/cliente_plan/{cliente_id}
    * Ruta DELETE para quitar la asignación de plan de un cliente. **Requiere permisos**.

### Pesaje
- /api/clientes/pesaje/crear
    * Ruta POST para crear un registro de peso y grasa corporal de un cliente. **Requiere permisos**.
- /api/clientes/pesaje/consultar/{cliente_id}
    * Ruta GET para consultar los datos de los pesajes de un cliente.
- /api/clientes/pesaje/modificar/{cliente_id}
    * Ruta PUT para modificar los datos de un pesaje de un cliente.
- /api/clientes/pesaje/eliminar/{cliente_id}
    * Ruta DELETE para eliminar los datos de un pesaje de un cliente.

### Rutinas
- /api/rutinas/
    * Ruta GET para ver la lista de rutinas actuales.
- /api/rutinas/crear
    * Ruta POST para crear una rutina de entrenamiento. **Requiere permisos**.
- /api/rutinas/modificar/{id}
    * Ruta PUT para modificar una rutina de entrenamiento. **Requiere permisos**.
- /api/rutinas/eliminar/{id}
    * Ruta DELETE para eliminar una rutina de entrenamiento. **Requiere permisos**.
- /api/rutinas/ejercicios/{id}
    * Ruta GET para obtener información sobre un ejercicio.
- /api/rutinas/ejercicios/crear
    * Ruta POST para crear un ejercicio. **Requiere permisos**.
- /api/rutinas/ejercicios/modificar/{id}
    * Ruta PUT para modificar un ejercicio. **Requiere permisos**.
- /api/rutinas/ejercicios/eliminar/{id}
    * Ruta DELETE para eliminar un ejercicio. **Requiere permisos**.
- /api/rutinas/asignar_ejercicio/
    * Ruta POST para asignar un ejercicio a una rutina. **Requiere permisos**.
- /api/rutinas/{rutina_id}/ejercicios/
    * Ruta GET para ver la lista de ejercicios de una rutina.
- /api/rutinas/{rutina_id}/{ejercicio_id}/
    * Ruta GET para ver los detalles de la asignación de un ejercicio.
- /api/rutinas/{rutina_id}/{ejercicio_id}/modificar/
    * Ruta PUT para modificar los datos de asignación de un ejercicio. **Requiere permisos**.
- /api/rutinas/{rutina_id}/{ejercicio_id}/eliminar/
    * Ruta DELETE para eliminar una asignación de un ejercicio.

#### Planes
- /api/planes/
    * Ruta GET para ver la lista de planes.
- /api/planes/{id}
    * Ruta GET para buscar los datos de un plan.
- /api/planes/crear
    * Ruta POST para crear un plan. **Requiere permisos**.
- /api/planes/modificar/{id}
    * Ruta PUT para modificar un plan. **Requiere permisos**.
- /api/planes/eliminar/{id}
    * Ruta DELETE para eliminar un plan. **Requiere permisos**.
- /api/planes/periodos/
    * Ruta GET para ver los períodos de renovación actuales.
- /api/planes/periodos/{id}
    * Ruta GET para buscar un período de renovación.
- /api/planes/periodos/crear
    * Ruta POST para crear un período de renovación de plan. **Requiere permisos**.
- /api/planes/periodos/modificar/{id}
    * Ruta PUT para modificar un período de renovación de plan. **Requiere permisos**.
- /api/planes/periodos/eliminar/{id}
    * Ruta DELETE para eliminar un período de renovación de plan. **Requiere permisos**.

### Dietas
- /api/dietas/
    * Ruta GET para ver la lista de dietas.
- /api/dietas/{id}
    * Ruta GET para buscar una dieta específica.
- /api/dietas/crear
    * Ruta POST para crear una dieta. **Requiere permisos**.
- /api/dietas/modificar/{id}
    * Ruta PUT para modificar una dieta. **Requiere permisos**.
- /api/dietas/eliminar/{id}
    * Ruta DELETE para eliminar una dieta. **Requiere permisos**.
- /api/dietas/comida/d:{id}
    * Ruta GET para ver la lista de todas las comidas.
- /api/dietas/comida/{id}
    * Ruta GET para buscar una comida específica.
- /api/dietas/comida/crear
    * Ruta POST para crear una comida perteneciente a una dieta. **Requiere permisos**.
- /api/dietas/alimento/modificar/{id}
    * Ruta POST para crear un alimento. **Requiere permisos**.
- /api/dietas/alimento/listar/
    * Ruta GET para ver la lista de todos los alimentos.
- /api/dietas/alimento/obtener/{id}
    * Ruta GET para buscar un alimento específico por ID.
- /api/dietas/alimento/modificar/{id}
    * Ruta PUT para modificar los datos de un alimento. **Requiere permisos**.
- /api/dietas/alimento/eliminar/{id}
    * Ruta DELETE para eliminar un alimento. **Requiere permisos**.
- /api/dietas/comida/modificar/{id}
    * Ruta PUT para modificar una comida perteneciente a una dieta. **Requiere permisos**.
- /api/dietas/comida/eliminar/{id}
    * Ruta DELETE para eliminar una comida perteneciente a una dieta. **Requiere permisos**.
- /api/dietas/{dieta_id}/alimento/
    * Ruta GET para ver los alimentos de una comida perteneciente a una dieta.
- /api/dietas/{dieta_id}/alimento/detalles/
    * Ruta GET para ver los detalles de cada comida perteneciente a una dieta.
- /api/dietas/comida/alimento/asignar
    * Ruta POST para asignar un alimento a una comida, que pertenece a una dieta. **Requiere permisos**.
- /api/dietas/comida/{comida_id}/alimento/{alimento_id}
    * Ruta GET para buscar una asignación por medio de la relación comida-alimento.
- /api/dietas/comida/{asignacion_id}/alimento/modificar
    * Ruta PUT para modificar la asignación de un alimento a una comida específica. **Requiere permisos**.
- /api/dietas/comida/{asignacion_id}/alimento/eliminar
    * Ruta DELETE para eliminar la asignación de un alimento a una comida específica. **Requiere permisos**.

## Notas de seguridad
La API tiene algunas limitaciones para el usuario, que no deben de ser alteradas:
- El token **no puede ser compartido**, debido a que contiene información sensible.
- Los roles solo pueden modificarse con **permisos de administrador**

# MyCoach
## Descripción general
### Propósito
Este proyecto incluye una interfaz web para consumir la API.

### Vista general
Página de inicio
![Inicio](/frontend/img/preview/pr-dashboard.png)

Página de rutinas
![Rutinas](/frontend/img/preview/pr-routines.png)

Página de dietas
![Dietas](/frontend/img/preview/pr-diets.png)

Página de perfil
![Perfil](/frontend/img/preview/pr-profile.png)

## Configuración e instalación

### Requisitos
- Node.js 18+
- npm o yarn

### Instalación
`cd frontend`
`npm install`
`npm run dev`