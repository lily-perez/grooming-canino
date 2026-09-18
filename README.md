# Sistema de Gestión de Grooming Canino

Base web del sistema interno para la gestión operativa de servicios de grooming
canino. El proyecto utiliza JavaScript, React, Next.js App Router y Tailwind CSS.

## Requisitos

- Node.js compatible con Next.js 16.
- npm.

## Instalación

```bash
npm install
```

## Variables de entorno

Crear `.env.local` a partir de `.env.example` y completar las variables cuando
el incremento correspondiente lo autorice:

```text
MOCK_API_BASE_URL=
```

INC-00 no configura recursos funcionales de MockAPI.

## Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).
La ruta raíz redirige temporalmente a `/login`.

## Verificaciones

```bash
npm run lint
npm run build
```

El endpoint técnico `GET /api/health` permite comprobar el funcionamiento de
los Route Handlers.
# Sistema Web de Gestión de Grooming Canino

Proyecto desarrollado para la asignatura DPS941.

## Descripción

El proyecto consiste en el desarrollo de una plataforma web para apoyar la gestión operativa de un negocio de grooming canino.

La solución permitirá centralizar la administración de clientes, perros, citas, servicios, tareas, historial de atención, usuarios y reportes.

## Tecnologías principales

- React
- Next.js
- Tailwind CSS
- Context API
- Firebase / Cloud Firestore
- Git y GitHub

## Roles del sistema

El sistema contempla dos roles principales:

- Administrador
- Groomer

Cada rol contará con permisos diferenciados según las funcionalidades que le correspondan.

## Módulos de la Etapa 2

- Autenticación y roles
- Clientes y perros
- Servicios y tareas
- Dashboard, historial y reportes
- Citas y disponibilidad

## Estructura base del proyecto

```text
src/
├── app/
├── components/
├── context/
├── hooks/
├── services/
└── utils/
```

## Organización del trabajo

Cada integrante desarrollará su módulo en una rama independiente del repositorio.

Posteriormente, los módulos serán integrados en la rama principal del proyecto.

## Estado del proyecto

Etapa 2 - Primer avance web con React + Next.js.
