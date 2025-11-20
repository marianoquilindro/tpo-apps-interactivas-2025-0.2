# 🚀 Gestor de Tareas Colaborativas — Backend API (TPI)

Aplicación **backend (API REST)** desarrollada para la **Gestión Colaborativa de Tareas**, implementando autenticación JWT, roles, control de acceso, y flujos de trabajo según los requisitos del **Trabajo Práctico Integrador (TPI)** de *Aplicaciones Interactivas – UADE 2025*.

---

## 🧩 Propósito

Este proyecto permite la **gestión integral de tareas** dentro de equipos de trabajo, cumpliendo con los principales puntos del TPI:

- Registro e inicio de sesión de usuarios.  
- Creación y administración de equipos.  
- Asignación de tareas y control de estado.  
- Comentarios, actividades y notificaciones automáticas.  
- Validación de datos, autenticación segura y control de roles.

---

## 🛠️ Tecnologías Clave Utilizadas

| Tecnología | Versión mínima | Propósito |
|-------------|----------------|------------|
| **Node.js** | v16+ | Entorno de ejecución |
| **TypeScript** | — | Lenguaje tipado para mayor robustez |
| **Express** | — | Framework para routing y middleware |
| **TypeORM** | — | ORM para persistencia de datos |
| **SQLite** | — | Base de datos embebida (sin servidor externo) |
| **bcrypt** | — | Cifrado de contraseñas |
| **jsonwebtoken (JWT)** | — | Autenticación basada en tokens |
| **class-validator** | — | Validación de DTOs |
| **dotenv** | — | Configuración de variables de entorno |

---

## 📂 Estructura del Proyecto (Arquitectura de 4 Capas)

El proyecto sigue una **arquitectura modular de 4 capas**, garantizando separación de responsabilidades:

| Carpeta | Rol | Ejemplos |
|----------|-----|-----------|
| `src/controllers/` | Controladores HTTP (manejo de peticiones y respuestas) | `usuariosController.ts`, `tareasController.ts` |
| `src/services/` | Lógica de negocio y validaciones | `usuariosService.ts`, `equiposService.ts` |
| `src/entities/` | Modelos de base de datos (TypeORM) | `Usuario.ts`, `Tarea.ts`, `Membresia.ts` |
| `src/routes/` | Definición de endpoints Express | `usuariosRoutes.ts`, `tareasRoutes.ts` |
| `src/middlewares/` | Seguridad y validación | `authMiddleware.ts`, `validateDto.ts` |

---

## 🧱 Entidades Principales

- **Usuario:** autenticación y gestión de perfiles.  
- **Equipo:** agrupación de usuarios con roles.  
- **Membresía:** relación usuario–equipo con roles `Propietario` / `Miembro`.  
- **Tarea:** núcleo del sistema (estado, prioridad, asignación).  
- **Etiqueta:** categorización de tareas.  
- **Comentario:** colaboración textual en las tareas.  
- **Actividad:** historial de acciones realizadas.  
- **Notificación:** alertas automáticas de eventos relevantes.

---

## ⚙️ Instalación y Ejecución

### 🔹 1️⃣ Requisitos Previos

Asegurarse de tener instalado:

- [Node.js v16 o superior](https://nodejs.org/en/download/)
- npm (v8 o superior, incluido con Node)
- (Opcional) Visual Studio Code con extensión **REST Client** o **Thunder Client** para pruebas.

---

### 🔹 2️⃣ Clonar el Repositorio

```bash
git clone https://github.com/usuario/gestor-tareas-backend.git
cd gestor-tareas-backend


🔹 3️⃣ Instalar Dependencias
npm install
Esto instalará todas las librerías necesarias listadas en el package.json.

🔹 5️⃣ Iniciar el Servidor
npm run dev

Verificá que aparezca en consola:

Conexión a la base de datos establecida.
Servidor Express escuchando en http://localhost:4000/api

Esto ejecutará el backend en modo desarrollo, generando automáticamente la base de datos (db.sqlite) y sus tablas mediante synchronize: true en data-source.ts.

🔹 6️⃣ Scripts Disponibles
Script	    Comando	Descripción
Dev	        npm run dev	Ejecuta el servidor con TypeScript en modo desarrollo
Build	    npm run build	Transpila el proyecto a JavaScript (carpeta /dist)
Start	    npm start	Ejecuta el proyecto compilado
Lint	    npm run lint	Analiza el código para mantener buenas prácticas


🔑 Endpoints Principales

Podés probarlos desde Postman, Thunder Client o el archivo request.http.


🔸 Autenticación
Método	    Endpoint	Descripción
POST	    /api/usuarios/signup	Crear cuenta de usuario
POST	    /api/usuarios/login	Iniciar sesión y obtener token JWT


🔸 Módulos Principales
Módulo	            Método	Endpoint	Descripción
Equipos	            POST	/api/equipos	Crear equipo
Membresías	        PATCH	/api/equipos/:id/role	Cambiar rol de un miembro
Tareas	            POST	/api/tareas	Crear tarea
Tareas	            PATCH	/api/tareas/:id/estado	Actualizar estado
Comentarios	        POST	/api/tareas/:tareaId/comentarios	Agregar comentario
Actividades	        GET	/api/tareas/:tareaId/actividad	Ver historial de cambios
Notificaciones	    GET	/api/notificaciones	Listar notificaciones del usuario
Notificaciones	    PATCH	/api/notificaciones/read	Marcar como leídas


🧩 Notas de Desarrollo
🔒 Seguridad
Las contraseñas se cifran con bcrypt antes de almacenarse.
Las rutas sensibles usan authMiddleware para validar JWT.
Los tokens expiran automáticamente y deben renovarse al iniciar sesión.

✅ Validación

Todos los DTOs (Data Transfer Objects) se validan con class-validator.
Errores de validación devuelven respuestas HTTP 400 Bad Request claras.

⚙️ Modelado
Las relaciones son unidireccionales (por ejemplo, Tarea → Comentario) para evitar dependencias circulares en TypeORM.

🧠 Arquitectura
La lógica de negocio se ubica exclusivamente en la capa Service,
dejando los Controllers limpios y simples.

💾 Base de Datos
Por defecto se usa SQLite, ubicada en db.sqlite.
No requiere instalación adicional.