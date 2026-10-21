Integrantes

Manuel Alejandro Mejia López - ML251320
Lily Astrid Pérez Avelar - PA251527
Ariel Omar Nunfio Méndez - NM253359
Levi Asael Valle Palma - VP253612
Wilber Larris Carranza Campos - CC253652

Sistema Multiplataforma de Gestión de Grooming Canino

Plataforma multiplataforma para la gestión operativa de un negocio de grooming canino. Centraliza clientes, perros, citas, servicios, tareas, disponibilidad de Groomers, historial de atención y un Dashboard administrativo, tanto en web como en aplicativo móvil.

Proyecto de la asignatura DPS941 — Diseño y Programación de Software Multiplataforma.

Objetivo

Reducir la dependencia de WhatsApp, llamadas y agenda física al coordinar atenciones. El sistema permite registrar dueños y mascotas, programar citas con uno o varios servicios, asignar Groomers mediante tareas, consultar disponibilidad, finalizar atenciones y revisar métricas operativas.

La solución contempla:

Una plataforma web orientada principalmente al Administrador.

Una aplicación móvil orientada a los Groomers y seguimiento en movilidad.

Estado funcional

Etapa 3 — Integración Web y Desarrollo Móvil.

Módulos disponibles en la solución:

Autenticación, registro y control de roles.

Usuarios y gestión del personal.

Clientes y perros.

Servicios y catálogo general.

Citas y asignación de tareas.

Disponibilidad y horarios de Groomers.

Historial / Registro de Atención.

Dashboard administrativo.

Módulos Móviles (Autenticación, Historial/Inicio y Tareas).

La ruta / redirige a /login.

El Groomer consulta y actualiza sus tareas asignadas desde sus vistas correspondientes.

Roles

Administrador: gestiona usuarios, clientes, perros, servicios, citas, horarios, asignaciones, historial y Dashboard.

Groomer: usuario con rol = groomer. Consulta y actualiza sus propias tareas. No administra el catálogo general.

Funcionalidades principales

Registro, inicio de sesión y rutas protegidas según rol.

Gestión de usuarios, clientes, perros, servicios, citas, tareas y horarios.

Relación Cliente → Perro → Cita. La cita guarda perroId; el cliente se obtiene a través del perro.

Citas con uno o varios servicios y horaFinEstimada calculada en servidor.

Tareas asociadas a una cita, con un Groomer por tarea.

Disponibilidad de Groomers calculada a partir de horarios y ocupaciones.

Dashboard administrativo

Resumen operativo calculado a partir de citas, tareas, servicios, clientes, perros e historial.

Incluye:

Métricas de citas de hoy, de la semana y del mes.

Filtros Hoy, Semana y Mes.

Cantidad de citas programadas, en proceso, completadas y canceladas.

Tareas activas.

Servicios más solicitados.

Clientes más frecuentes.

Gráfico de citas por día.

Próximas citas y actividad reciente.

Historial / Registro de Atención

Al finalizar una cita en proceso con todas sus tareas completadas:

Se crea un registro de atención.

La cita pasa a estado completada.

El registro queda disponible en el historial y en su detalle.

 Etapa Móvil (Aplicación Móvil)

Se ha integrado la capa móvil para la gestión operativa y consulta en dispositivos móviles.

 Módulos e Integraciones Móviles

Autenticación y Roles (feature/mobile-autenticacion-roles): Inicio de sesión y asignación de permisos según el rol del usuario en dispositivos móviles.

Historial e Inicio (feature/mobile-home-historial): Pantalla principal móvil e historial de atenciones y servicios realizados.

Gestión de Tareas Móvil (feature/tareas-movil): Panel interactivo para la visualización, seguimiento y actualización del estado de tareas asignadas al personal en movimiento.

Tecnologías

JavaScript

React

Next.js 16.3.4 (App Router)

Tailwind CSS

Context API

API REST con Route Handlers de Next.js

MockAPI como persistencia temporal del servidor

Arquitectura

UI
→ Hook / Context
→ Repository
→ Service
→ /api/*
→ Route Handler
→ Validación + autorización
→ Adapter
→ mockApiClient
→ MockAPI


El navegador no consume MockAPI de forma directa.

Los services del cliente llaman a la API interna de Next.js (/api/*).

Los repositories aíslan el acceso a datos.

Los permisos se validan en los Route Handlers, no solo en la interfaz.

Estructura del proyecto

src/
├── app/                 Rutas web y Route Handlers
│   ├── admin/
│   ├── groomer/
│   └── api/
├── components/          Interfaz y pantallas de cada módulo
├── context/             Estado compartido de sesión
├── hooks/               Carga de datos y estados de UI
├── repositories/        Acceso a datos desde el frontend
├── server/              Autenticación, persistencia y reglas
│   ├── autenticacion/
│   ├── persistencia/
│   └── reglas/
├── services/            Cliente HTTP hacia /api/*
└── utils/               Validaciones y utilidades


Persistencia

MockAPI se usa como persistencia temporal. Recursos actuales:

/usuarios
/servicios
/tareas
/citas
/horarios
/clientes
/perros
/historial


Requisitos previos

Node.js compatible con Next.js 16

npm

Variables de entorno

Copiar .env.example a .env.local y completar los valores locales:

cp .env.example .env.local


MOCK_API_BASE_URL=
AUTH_SESSION_SECRET=


Instalación y ejecución

npm install
npm run dev


La aplicación queda disponible en http://localhost:3000.

Comandos disponibles

npm install      # instala dependencias
npm run dev      # entorno de desarrollo
npm run lint     # análisis estático
npm run build    # compilación de producción


Rutas principales

Públicas:

/login
/registro


Administrador:

/admin/dashboard
/admin/usuarios
/admin/servicios
/admin/citas
/admin/groomers
/admin/clientes
/admin/perros
/admin/historial


Groomer:

/groomer/dashboard
/groomer/servicios