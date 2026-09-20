# Sistema Multiplataforma de Gestión de Grooming Canino

Plataforma web interna para la gestión operativa de un negocio de grooming
canino. Centraliza clientes, perros, citas, servicios, tareas, disponibilidad
de Groomers y usuarios.

Proyecto de la asignatura **DPS941 — Diseño y Programación de Software
Multiplataforma**. Esta etapa corresponde al **aplicativo web**. La aplicación
móvil se desarrollará posteriormente.

## Objetivo

Reducir la dependencia de WhatsApp, llamadas y agenda física al coordinar
atenciones. El sistema permite registrar dueños y mascotas, programar citas con
uno o varios servicios, asignar Groomers mediante tareas y consultar
disponibilidad real.

La solución final contemplará:

- una plataforma web orientada principalmente al Administrador;
- una aplicación móvil orientada principalmente a los Groomers.

## Estado actual

Etapa 2 — Desarrollo Base del Proyecto Web.

Rama de integración vigente: `integracion`.

Ya está implementada la base operativa de autenticación, usuarios, servicios,
tareas, citas, disponibilidad, horarios, clientes y perros. El Dashboard
todavía no presenta métricas calculadas y el módulo de RegistroAtencion e
Historial continúa pendiente de implementación completa.

La ruta raíz redirige a `/login`.

## Funcionalidades

### Implementadas

- Autenticación y roles (registro, login, sesión y rutas protegidas).
- Gestión administrativa de Usuarios.
- Catálogo de Servicios.
- Tareas asociadas a una Cita, con un Groomer por tarea.
- Citas con múltiples servicios y `horaFinEstimada` calculada.
- Disponibilidad de Groomers calculada a partir de horarios y ocupaciones.
- Horarios laborales de cada Groomer.
- Clientes y Perros, con relación Cliente → Perros.
- Integración Cliente → Perro → Cita (`Cita.perroId` apunta a un Perro real).

Un **Cliente** registra nombre, teléfono, correo, observaciones y estado
activo/inactivo.

Un **Perro** pertenece a un Cliente y registra nombre, raza, sexo, fecha de
nacimiento, observaciones y estado activo/inactivo. La Cita no guarda
`clienteId`: el Cliente se obtiene a través del Perro.

Una Cita puede incluir varios Servicios. El Groomer se asigna en la Tarea, no
en la Cita. La disponibilidad se calcula; no se almacena como entidad.

### Pendientes o incompletas

- Registro de atención (`RegistroAtencion`).
- Historial completo.
- Adjuntos.
- Finalización completa de Citas (el endpoint de finalizar existe, pero no
  crea todavía el registro de atención).
- Dashboard calculado.
- Reportes.
- Vista dedicada `/groomer/tareas` (el Groomer opera hoy desde
  `/groomer/servicios`).

## Roles

- **Administrador:** gestiona usuarios, clientes, perros, servicios, citas,
  horarios y asignaciones.
- **Groomer:** es un `Usuario` con `rol = groomer`. Consulta y actualiza sus
  propias tareas. No administra el catálogo general.

## Tecnologías

- JavaScript
- React
- Next.js 16.3.4 (App Router)
- Tailwind CSS
- Context API
- API REST con Route Handlers de Next.js
- MockAPI como persistencia temporal del servidor
- Git y GitHub
- Vercel

Firebase, Firestore, Prisma, Supabase, Redux, Axios y TypeScript no forman
parte de esta etapa.

## Arquitectura

Los módulos integrados siguen este flujo:

```text
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
```

- El frontend no consume MockAPI de forma directa.
- `MOCK_API_BASE_URL` se usa únicamente en el servidor.
- Los services del cliente llaman a la API interna de Next.js (`/api/*`).
- Los repositories aíslan la lógica del mecanismo de acceso a datos.
- Los permisos importantes se validan otra vez en los Route Handlers.

## Estructura del proyecto

```text
src/
├── app/                 Rutas web (admin, groomer, login) y Route Handlers
│   ├── admin/
│   ├── groomer/
│   └── api/
├── components/          Interfaz reutilizable y pantallas de cada módulo
├── context/             Estado compartido (sesión y, cuando aplica, servicios)
├── hooks/               Coordinación de carga, mutaciones y estados de UI
├── repositories/        Acceso a datos desde el frontend
├── server/              Autenticación, persistencia y reglas de negocio
│   ├── autenticacion/
│   ├── persistencia/
│   └── reglas/
├── services/            Cliente HTTP hacia /api/*
└── utils/               Validaciones y utilidades compartidas
```

## Persistencia temporal

MockAPI es la persistencia temporal de la Etapa 2. Los Route Handlers se
comunican con ella a través de adapters. Recursos actuales:

```text
/usuarios
/servicios
/tareas
/citas
/horarios
/clientes
/perros
```

La disponibilidad no se persiste: se calcula en servidor.

## Variables de entorno

Copiar `.env.example` a `.env.local` y completar los valores locales:

```bash
cp .env.example .env.local
```

Variables definidas en `.env.example`:

```text
MOCK_API_BASE_URL=
AUTH_SESSION_SECRET=
```

No commitear `.env.local` ni secretos. `MOCK_API_BASE_URL` no debe exponerse al
navegador.

## Instalación

Requisitos: Node.js compatible con Next.js 16 y npm.

```bash
npm install
```

## Ejecución local

```bash
npm run dev
```

En condiciones normales la aplicación queda en
[http://localhost:3000](http://localhost:3000). Si el puerto 3000 está ocupado,
Next.js puede asignar otro.

La ruta `/` redirige a `/login`.

## Validaciones técnicas

```bash
npm run lint
npm run build
```

`GET /api/health` comprueba que los Route Handlers responden. No hay una
batería de pruebas automatizadas de negocio en esta etapa.

## Rutas principales

Públicas:

```text
/login
/registro
```

Administrador:

```text
/admin/dashboard
/admin/usuarios
/admin/servicios
/admin/citas
/admin/groomers
/admin/clientes
/admin/perros
```

Groomer:

```text
/groomer/dashboard
/groomer/servicios
```

## Organización del trabajo

Cada integrante desarrolla su módulo en una rama independiente. Los avances se
integran después en la rama compartida del proyecto (`integracion` en esta
etapa).
