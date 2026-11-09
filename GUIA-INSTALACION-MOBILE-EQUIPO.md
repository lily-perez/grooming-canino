# Guía de instalación — App móvil Grooming Canino

Guía para que cualquier desarrollador del equipo clone el repositorio y ejecute la app móvil en Windows (PowerShell), sin volver a crear el proyecto Firebase, los clientes OAuth ni el proyecto EAS.

**Stack:** Expo SDK 57 · Firebase Authentication · Firestore · Google Sign-In nativo · EAS Development Build (Android)

**Proyecto Firebase del equipo:** `grooming-canino-udb`  
**Package Android:** `com.groomingcanino.udb`  
**Organización Expo/EAS:** `larrisdev-team`  
**Proyecto Expo:** `grooming-canino`

---

## A. Preparación

### Requisitos previos

- Node.js LTS (recomendado 20+) y npm
- Git
- Para dispositivo físico Android: USB debugging activado, o un emulador Android
- Cuenta Expo con acceso a la organización `larrisdev-team` (solo si vas a bajar/generar builds EAS)

### Clonar o actualizar el repositorio

```powershell
# Clonar (primera vez)
git clone <URL_DEL_REPOSITORIO> D:\UDB\grooming-canino
cd D:\UDB\grooming-canino

# O actualizar main si ya tienes el repo
cd D:\UDB\grooming-canino
git checkout main
git pull origin main
```

### Entrar a mobile e instalar dependencias

```powershell
cd D:\UDB\grooming-canino\mobile
npm ci
```

Si `npm ci` falla por desajuste de lockfile, usa `npm install` y avisa al equipo.

---

## B. Configuración de Firebase (archivo `.env`)

1. Copia el ejemplo:

```powershell
cd D:\UDB\grooming-canino\mobile
Copy-Item .env.example .env
```

2. Abre `mobile/.env` y completa estas variables **obligatorias** (pídelas al responsable de Firebase; no las inventes):

| Variable | Uso |
| --- | --- |
| `EXPO_PUBLIC_FIREBASE_API_KEY` | Firebase JS |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | Auth domain |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | Debe ser el proyecto del equipo |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | App Firebase |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Sender ID |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | Web Client ID del proveedor Google (Sign-In nativo) |

Opcionales (el código tiene fallback): `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`, `EXPO_PUBLIC_API_URL`.

3. Todos los desarrolladores usan el **mismo** proyecto Firebase del equipo. No crees otro proyecto ni otra app Android.

4. **`mobile/.env` no debe subirse a GitHub.** Está en `.gitignore`. Solo versionamos `mobile/.env.example`.

---

## C. Ejecución con Expo Go (correo y contraseña)

Sirve para probar login/logout con correo, persistencia y roles **sin** Google nativo.

```powershell
cd D:\UDB\grooming-canino\mobile
npx expo start --clear
```

Abre el proyecto en **Expo Go** (mismo Wi‑Fi o túnel según tu red).

**Importante:** Google Sign-In nativo **no funciona en Expo Go** (falta el módulo `RNGoogleSignin`). La app debe mostrar un mensaje claro si pulsas «Continuar con Google». Usa correo/contraseña en Expo Go.

---

## D. Ejecución con Development Build (Google Sign-In)

### Por qué una APK del equipo

La APK de desarrollo ya incluye el código nativo de Google Sign-In y está firmada con el keystore EAS del equipo (SHA-1 ya registrada en Firebase). Usar esa APK evita volver a crear credenciales de firma y registrar otra huella.

### Pasos

1. **Obtener la APK** de desarrollo actual (enlace EAS, Drive del equipo o quien la generó).
2. **Instálala** en el teléfono/emulador Android (acepta orígenes desconocidos si aplica).
3. Arranca Metro en modo dev client:

```powershell
cd D:\UDB\grooming-canino\mobile
npx expo start --dev-client --clear
```

4. Abre la app **development build** (no Expo Go) y conéctala al servidor Metro (QR, URL o misma red).
5. Prueba «Continuar con Google». Si el usuario aún no tiene documento `usuarios/{uid}` con `activo: true` y `rol` válido, verá la pantalla de sin permiso (comportamiento esperado). Un administrador asigna el rol en Firestore.

---

## E. EAS y compilaciones nuevas

El proyecto **ya está vinculado** a:

- Organización: `larrisdev-team`
- Proyecto Expo: `grooming-canino`

**No** crees otro proyecto Expo ni otra aplicación Firebase.

### Cuándo sí necesitas EAS CLI

- La APK del equipo está desactualizada y hace falta un build nuevo.
- Cambiaste plugins nativos / `app.json` / dependencias nativas y te autorizaron a rebuild.

### Requisitos

- Permisos en la org `larrisdev-team`
- EAS CLI autenticado:

```powershell
npm install --global eas-cli
eas login
cd D:\UDB\grooming-canino\mobile
eas build --platform android --profile development
```

**Cuidado:** un build firmado con **otro** keystore implica **otra SHA-1**. Habría que registrarla en Firebase (y posiblemente actualizar `google-services.json`) o Google Sign-In fallará. Prefiere el keystore/perfil EAS del equipo.

---

## F. Problemas frecuentes

| Síntoma | Qué hacer |
| --- | --- |
| Error de configuración Firebase / placeholders | Crea `mobile/.env` desde `.env.example` y completa las variables |
| Módulos no encontrados | `cd mobile` → `npm ci` |
| El teléfono no ve Metro | Misma red Wi‑Fi, firewall, o usa túnel; con APK usa `--dev-client` |
| Google no funciona en Expo Go | Normal. Usa la APK development build |
| Google falla en APK vieja | Pide la APK actual del equipo o un rebuild autorizado |
| Entraste con Google pero «Sin acceso» | Falta rol activo en `usuarios/{uid}`; pide a un admin que lo asigne |
| Error OAuth / `DEVELOPER_ERROR` / SHA-1 | La APK no coincide con la SHA registrada; usa la APK del equipo o registra la huella correcta (coordinado) |

---

## Recordatorios de seguridad

- No subas `.env`, keystores, ni JSON de cuentas de servicio.
- Sí está versionado: `mobile/google-services.json` (configuración de cliente Android del equipo).
- Los roles no se autoasignan al iniciar sesión con Google.
