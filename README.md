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
