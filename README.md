# Spa-Nirvana-Backend
Proyecto de backend para Nirvana Spa and Beauty, enfocado en la gestión de la base de datos.

## Descripción
Este proyecto es el backend de la aplicación Nirvana Spa and Beauty. Proporciona una API RESTful para manejar datos relacionados con servicios de spa, clientes, reservas y más. Utiliza Node.js, Express, MongoDB para la implementación, además de herramientas como jsonwebtoken, bcrypts y express-validator para las distintas validaciones.

## Cómo Funciona
La aplicación backend expone endpoints para:
- Gestión de usuarios y autenticación.
- CRUD de servicios (masajes, tratamientos, etc.).
- Reservas y citas.
- Integración con base de datos para almacenamiento persistente.

El flujo típico para un tester:
1. Inicia el servidor backend.
2. Usa herramientas como Postman para enviar requests a los endpoints.
3. Verifica respuestas, manejo de errores y validaciones.

## Especificaciones Técnicas
- **Lenguaje**: JavaScript/Node.js
- **Base de Datos**: MongoDB
- **Dependencias**: - **bcryptjs** : versión ^3.0.3, librería de JS usada para hasheo de contraseña
                    - **cloudinary** : versión ^2.8.0, herramienta usada para carga o modificación de imágenes
                    - **cors** : versión ^2.8.5, middleware usado para acceso a la API desde el fronted
                    - **dotenv** : versión ^17.2.3, librería usada para gestionar claves del .env
                    - **express** : versión ^5.1.0, framework usado para manejo de rutas, middlewares y respuestas
                    - **express-validator** : versión ^7.3.1, middleware de express.js usado para validaciones
                    - **jsonwebtoken** : versión ^9.0.2, librería de Node.js usada para crear y verificar tokens de identidad
                    - **mongoose** : ^8.20.0, librería usada para definir modelos y conectar a la base de datos de MongoDB
- **Puerto**: 3000
- **Autenticación**: JWT
- **Usuario Admin**: El siguiente es un ejemplo de usuario admin el cuál le permitirá realizar acciones como obtener, agregar, modificar y/o eliminar ya sea usuarios (comunes o administradores), servicios o categorías. Aclarando también que la eliminación no es física.

    - Email : nazarenamolina2@gmail.com
    - Contraseña : 123456

- **Usuario Común**: El siguiente es un ejemplo de usuario común, el cuál ya está registrado en la base de datos, con el mismo, únicamente podrá modificar sus datos personales, no podrá realizar otras acciones.

    - Email : usuario2026@gmail.com
    - Contraseña : 123456


## Instalación y Configuración
1. Clona el repositorio.
2. Instala dependencias: `npm install`
3. Configura variables de entorno (ej. conexión a DB).
4. Ejecuta: `npm start`

## Pruebas
- Ejecuta pruebas unitarias: `npm test`
- Para testing manual: Usa Postman con la colección de endpoints proporcionada.
- Verifica logs en la consola para debugging.

## Rutas
- Ruta para login y autenticado : `api/auth`
- Ruta usuarios : `api/usuarios`
- Ruta profesionales

## Endpoints Principales
- `GET /api/servicios`: Lista servicios.
- `GET /api/usuarios`: Lista usuarios, tanto comunes como admins.
- `POST /api/usuarios`: Crear un nuevo usario, especificando si es admin, profesional o usuario.
- `DELETE /api/usuarios`: Eliminado lógico de un usuario.
- `GET /api/reservas`: Lista reservas realizadas.
- `DELETE /api/reservas`: Eliminado lógico de una reserva.
