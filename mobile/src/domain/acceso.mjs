export const PROYECTO_FIREBASE = 'grooming-canino-udb';

export const MENSAJE_CONFIG_FIREBASE =
  'Falta la configuración pública de Firebase en esta computadora. Define EXPO_PUBLIC_FIREBASE_API_KEY, EXPO_PUBLIC_FIREBASE_APP_ID y EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID.';

export const MENSAJE_PROYECTO_FIREBASE =
  'La configuración de Firebase no apunta al proyecto del equipo.';

const MARCADORES_PUBLICOS = new Set([
  '',
  'TU_API_KEY',
  '123456789',
  '1:123456789:web:abcdef',
]);

const ROLES = new Set(['administrador', 'groomer']);

export function motivoConfiguracionInvalida(config) {
  if (!config || config.projectId !== PROYECTO_FIREBASE) {
    return MENSAJE_PROYECTO_FIREBASE;
  }

  if (
    MARCADORES_PUBLICOS.has(config.apiKey ?? '') ||
    MARCADORES_PUBLICOS.has(config.appId ?? '') ||
    MARCADORES_PUBLICOS.has(config.messagingSenderId ?? '')
  ) {
    return MENSAJE_CONFIG_FIREBASE;
  }

  return null;
}

export function nombrePersistencia(plataforma) {
  return plataforma === 'web' ? 'browserLocal' : 'react-native-async-storage';
}

export function mensajeDeErrorAuth(codigo) {
  switch (codigo) {
    case 'auth/invalid-email':
      return 'El correo no es válido.';
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
      return 'Correo o contraseña incorrectos.';
    case 'auth/network-request-failed':
      return 'No hay conexión. Revisa la red e inténtalo de nuevo.';
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Espera un momento y vuelve a intentar.';
    case 'auth/user-disabled':
      return 'Esta cuenta está deshabilitada.';
    case 'auth/account-exists-with-different-credential':
      return 'Este correo ya tiene otro método de acceso. Entra con correo y contraseña. No se creó otra cuenta ni se vincularon los proveedores.';
    default:
      return 'No se pudo iniciar sesión.';
  }
}

function rolConfiable(valor) {
  return ROLES.has(valor) ? valor : null;
}

function nombreVisible(documento, nombreAuth) {
  if (typeof documento?.nombre === 'string' && documento.nombre.trim()) {
    return documento.nombre.trim();
  }

  if (typeof nombreAuth === 'string' && nombreAuth.trim()) {
    return nombreAuth.trim();
  }

  return '';
}

// El rol solo sale de custom claims o del documento usuarios/{uid}.
// Cualquier otro campo, incluido uno enviado por el cliente, se ignora.
export function resolverAcceso({
  uid,
  correoAuth,
  nombreAuth,
  claims,
  documento,
}) {
  const claimsPresentes = claims && typeof claims === 'object';
  const tieneClaimDeRol = Boolean(
    claimsPresentes && Object.prototype.hasOwnProperty.call(claims, 'rol'),
  );
  let rol = null;
  let activo = false;
  let fuente = 'ninguna';

  if (tieneClaimDeRol) {
    rol = rolConfiable(claims.rol);
    activo = claims.activo === true && Boolean(rol);
    fuente = 'claims';
  } else {
    rol = rolConfiable(documento?.rol);
    activo = documento?.activo === true && Boolean(rol);
    fuente = rol && activo ? 'firestore' : 'ninguna';
  }

  const permitido = Boolean(rol) && activo;

  return {
    uid: uid ?? null,
    id: uid ?? null,
    correo: typeof correoAuth === 'string' ? correoAuth : '',
    nombre: nombreVisible(documento, nombreAuth),
    rol: permitido ? rol : null,
    activo: permitido,
    fuente: permitido ? fuente : 'ninguna',
  };
}

export function destinoNavegacion({ cargando, usuario }) {
  if (cargando) {
    return 'cargando';
  }

  if (!usuario) {
    return 'login';
  }

  if (usuario.activo === true && usuario.rol === 'administrador') {
    return 'administrador';
  }

  if (usuario.activo === true && usuario.rol === 'groomer') {
    return 'groomer';
  }

  return 'sin-permiso';
}

export function reducirSesion(estado, evento) {
  switch (evento?.tipo) {
    case 'inicio':
      return { usuario: null, cargando: true, aviso: '' };
    case 'verificando':
      return { ...estado, cargando: true };
    case 'sin-usuario':
      return { usuario: null, cargando: false, aviso: '' };
    case 'perfil':
      return {
        usuario: evento.usuario ?? null,
        cargando: false,
        aviso: evento.aviso ?? '',
      };
    case 'aviso':
      return { ...estado, aviso: evento.aviso ?? '' };
    default:
      return estado;
  }
}

export function tokenGoogle(resultado) {
  if (!resultado || resultado.type === 'cancelled') {
    return { cancelado: true, idToken: null };
  }

  const idToken = resultado?.data?.idToken || resultado?.idToken || null;

  return { cancelado: false, idToken };
}

export function decisionGoogle(resultado) {
  const token = tokenGoogle(resultado);

  if (token.cancelado) {
    return {
      accion: 'cancelado',
      mensaje: 'Inicio con Google cancelado.',
    };
  }

  if (!token.idToken) {
    return {
      accion: 'error',
      mensaje:
        'Google no devolvió un token de identidad. No se creó una sesión ni un rol.',
    };
  }

  return { accion: 'credencial', idToken: token.idToken };
}

export async function ejecutarInicioCorreo({
  correo,
  contrasena,
  motivoConfig,
  signIn,
}) {
  if (motivoConfig) {
    throw new Error(motivoConfig);
  }

  try {
    const usuario = await signIn(String(correo ?? '').trim(), contrasena);

    if (!usuario?.uid) {
      throw new Error('No se pudo iniciar sesión.');
    }

    return { uid: usuario.uid };
  } catch (error) {
    if (error?.code) {
      throw new Error(mensajeDeErrorAuth(error.code));
    }

    throw error instanceof Error ? error : new Error('No se pudo iniciar sesión.');
  }
}
