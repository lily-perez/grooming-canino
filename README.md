#Integrantes

Manuel Alejandro Mejia López - ML251320

Lily Astrid Pérez Avelar - PA251527

Ariel Omar Nunfio Méndez - NM253359

Levi Asael Valle Palma - VP253612

Wilber Larris Carranza Campos - CC253652

# Sistema Multiplataforma de Gestión de Grooming Canino

Plataforma web interna para la gestión operativa de un negocio de grooming
canino. Centraliza clientes, perros, citas, servicios, tareas, disponibilidad
de Groomers, historial de atención y un Dashboard administrativo.

Proyecto de la asignatura **DPS941 — Diseño y Programación de Software
Multiplataforma**. Esta etapa corresponde al aplicativo web. La aplicación
móvil se desarrollará posteriormente.

## Objetivo

Reducir la dependencia de WhatsApp, llamadas y agenda física al coordinar
atenciones. El sistema permite registrar dueños y mascotas, programar citas con
uno o varios servicios, asignar Groomers mediante tareas, consultar
disponibilidad, finalizar atenciones y revisar métricas operativas.

La solución final contemplará:

- una plataforma web orientada principalmente al Administrador;
- una aplicación móvil orientada principalmente a los Groomers.

## Estado funcional

Etapa 2 — Desarrollo Base del Proyecto Web.

Módulos disponibles:

- autenticación y roles;
- usuarios;
- clientes y perros;
- servicios;
- citas y tareas;
- disponibilidad y horarios de Groomers;
- Historial / Registro de Atención;
- Dashboard administrativo.

La ruta `/` redirige a `/login`.

Aún no forman parte de esta etapa el módulo de Reportes, los adjuntos, un
Dashboard calculado para Groomer ni una vista dedicada `/groomer/tareas`. El
Groomer consulta y actualiza sus tareas desde `/groomer/servicios`.

## Roles

- **Administrador:** gestiona usuarios, clientes, perros, servicios, citas,
  horarios, asignaciones, historial y Dashboard.
- **Groomer:** usuario con `rol = groomer`. Consulta y actualiza sus propias
  tareas. No administra el catálogo general.

## Funcionalidades principales

- Registro, inicio de sesión y rutas protegidas según rol.
- Gestión de usuarios, clientes, perros, servicios, citas, tareas y horarios.
- Relación Cliente → Perro → Cita. La cita guarda `perroId`; el cliente se
  obtiene a través del perro.
- Citas con uno o varios servicios y `horaFinEstimada` calculada en servidor.
- Tareas asociadas a una cita, con un Groomer por tarea.
- Disponibilidad de Groomers calculada a partir de horarios y ocupaciones. No
  se persiste como entidad.

### Dashboard administrativo

Resumen operativo calculado a partir de citas, tareas, servicios, clientes,
perros e historial. No se almacena un recurso propio de Dashboard.

Incluye:

- métricas de citas de hoy, de la semana y del mes;
- filtros **Hoy**, **Semana** y **Mes**;
- cantidad de citas programadas, en proceso, completadas y canceladas;
- tareas activas;
- servicios más solicitados;
- clientes más frecuentes;
- gráfico de citas por día;
- próximas citas;
- actividad reciente, con búsqueda por cliente o perro.

Endpoint: `GET /api/dashboard/resumen?periodo=hoy|semana|mes`.

### Historial / Registro de Atención

Al finalizar una cita en proceso con todas sus tareas completadas:

- se crea un registro de atención;
- la cita pasa a estado `completada`;
- el registro queda disponible en el historial y en su detalle.

El historial es la consulta de esos registros de atención, no una entidad
adicional. Se persiste en MockAPI `/historial`.

## Tecnologías

- JavaScript
- React
- Next.js 16.3.4 (App Router)
- Tailwind CSS
- Context API
- API REST con Route Handlers de Next.js
- MockAPI como persistencia temporal del servidor

Esta etapa no utiliza TypeScript, Redux, Axios, Firebase, Firestore, Prisma ni
Supabase.

## Arquitectura

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

- El navegador no consume MockAPI de forma directa.
- Los services del cliente llaman a la API interna de Next.js (`/api/*`).
- Los repositories aíslan el acceso a datos.
- Los permisos se validan en los Route Handlers, no solo en la interfaz.

## Estructura del proyecto

```text
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
```

## Persistencia

MockAPI se usa como persistencia temporal. Los Route Handlers se comunican con
ella a través de adapters. Recursos actuales:

```text
/usuarios
/servicios
/tareas
/citas
/horarios
/clientes
/perros
/historial
```

Relaciones principales:

```text
Cita.perroId → Perro.id
Perro.clienteId → Cliente.id
Cita.servicioIds → Servicio.id
Tarea.citaId → Cita.id
Tarea.servicioId → Servicio.id
Tarea.groomerId → Usuario.id
```

`/historial` almacena registros de atención. La disponibilidad se calcula en
servidor.

## Requisitos previos

- Node.js compatible con Next.js 16
- npm

## Variables de entorno

Copiar `.env.example` a `.env.local` y completar los valores locales:

```bash
cp .env.example .env.local
```

```text
MOCK_API_BASE_URL=
AUTH_SESSION_SECRET=
```

`MOCK_API_BASE_URL` es privada del servidor. No debe exponerse al navegador ni
definirse como `NEXT_PUBLIC_*`. No commitear `.env.local` ni secretos.

## Instalación y ejecución

```bash
npm install
npm run dev
```

La aplicación queda en [http://localhost:3000](http://localhost:3000). Si el
puerto 3000 está ocupado, Next.js puede asignar otro.

## Comandos disponibles

```bash
npm install      # instala dependencias
npm run dev      # entorno de desarrollo
npm run lint     # análisis estático
npm run build    # compilación de producción
```

`GET /api/health` comprueba que los Route Handlers responden.

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
/admin/historial
```

Groomer:

```text
/groomer/dashboard
/groomer/servicios
```
