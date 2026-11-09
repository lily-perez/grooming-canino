import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  MENSAJE_CONFIG_FIREBASE,
  decisionGoogle,
  destinoNavegacion,
  ejecutarInicioCorreo,
  mensajeDeErrorAuth,
  motivoConfiguracionInvalida,
  nombrePersistencia,
  reducirSesion,
  resolverAcceso,
} from './acceso.mjs';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

test('la configuración de ejemplo no se considera lista', () => {
  assert.equal(
    motivoConfiguracionInvalida({
      apiKey: 'TU_API_KEY',
      appId: '1:123456789:web:abcdef',
      messagingSenderId: '123456789',
      projectId: 'grooming-canino-udb',
    }),
    MENSAJE_CONFIG_FIREBASE,
  );
  assert.equal(
    motivoConfiguracionInvalida({
      apiKey: 'publica',
      appId: '1:1:web:abc',
      messagingSenderId: '100',
      projectId: 'otro-proyecto',
    }) !== null,
    true,
  );
  assert.equal(
    motivoConfiguracionInvalida({
      apiKey: 'publica',
      appId: '1:1:web:abc',
      messagingSenderId: '100',
      projectId: 'grooming-canino-udb',
    }),
    null,
  );
});

test('F2 credenciales inválidas no dejan sesión', async () => {
  let sesion = null;

  await assert.rejects(
    () =>
      ejecutarInicioCorreo({
        correo: 'persona@ejemplo.com',
        contrasena: 'incorrecta',
        motivoConfig: null,
        signIn: async () => {
          const error = new Error('credencial');
          error.code = 'auth/invalid-credential';
          throw error;
        },
      }),
    /Correo o contraseña incorrectos/,
  );

  const estado = reducirSesion(
    { usuario: null, cargando: false, aviso: '' },
    { tipo: 'sin-usuario' },
  );
  sesion = estado.usuario;
  assert.equal(sesion, null);
  assert.equal(destinoNavegacion(estado), 'login');
});

test('errores de correo, red, intentos y cuenta deshabilitada', () => {
  assert.match(mensajeDeErrorAuth('auth/invalid-email'), /no es válido/);
  assert.match(mensajeDeErrorAuth('auth/network-request-failed'), /conexión/);
  assert.match(mensajeDeErrorAuth('auth/too-many-requests'), /Demasiados intentos/);
  assert.match(mensajeDeErrorAuth('auth/user-disabled'), /deshabilitada/);
  assert.match(
    mensajeDeErrorAuth('auth/account-exists-with-different-credential'),
    /No se creó otra cuenta/,
  );
});

test('F1 simulado conserva el uid que devuelve el proveedor', async () => {
  const resultado = await ejecutarInicioCorreo({
    correo: ' persona@ejemplo.com ',
    contrasena: 'secreta',
    motivoConfig: null,
    signIn: async (correo) => {
      assert.equal(correo, 'persona@ejemplo.com');
      return { uid: 'uid-firebase-real' };
    },
  });

  assert.equal(resultado.uid, 'uid-firebase-real');
});

test('F3 elige persistencia de React Native fuera de la web', () => {
  assert.equal(nombrePersistencia('ios'), 'react-native-async-storage');
  assert.equal(nombrePersistencia('android'), 'react-native-async-storage');
  assert.equal(nombrePersistencia('web'), 'browserLocal');
});

test('F4 cerrar sesión vuelve al login', () => {
  const conSesion = reducirSesion(
    { usuario: null, cargando: true, aviso: '' },
    {
      tipo: 'perfil',
      usuario: { uid: 'u1', rol: 'groomer', activo: true },
      aviso: '',
    },
  );
  const cerrada = reducirSesion(conSesion, { tipo: 'sin-usuario' });

  assert.equal(cerrada.usuario, null);
  assert.equal(destinoNavegacion(cerrada), 'login');
});

test('F5 Google cancelado o sin token no pide credencial', () => {
  assert.equal(decisionGoogle({ type: 'cancelled' }).accion, 'cancelado');
  assert.equal(decisionGoogle({ data: {} }).accion, 'error');
  assert.deepEqual(decisionGoogle({ data: { idToken: 'token-google' } }), {
    accion: 'credencial',
    idToken: 'token-google',
  });
});

test('F6 el groomer no recibe destino de administrador', () => {
  const usuario = resolverAcceso({
    uid: 'groomer-uid',
    correoAuth: 'groomer@ejemplo.com',
    claims: {},
    documento: { rol: 'groomer', activo: true, privilegio: 'administrador' },
    rol: 'administrador',
  });

  assert.equal(usuario.rol, 'groomer');
  assert.equal(usuario.activo, true);
  assert.equal(destinoNavegacion({ cargando: false, usuario }), 'groomer');
  assert.notEqual(destinoNavegacion({ cargando: false, usuario }), 'administrador');
});

test('F7 el administrador sale de claims o del documento, nunca del cliente', () => {
  const porClaims = resolverAcceso({
    uid: 'admin-uid',
    correoAuth: 'admin@ejemplo.com',
    claims: { rol: 'administrador', activo: true },
    documento: { rol: 'groomer', activo: true },
  });
  const porDocumento = resolverAcceso({
    uid: 'admin-uid',
    correoAuth: 'admin@ejemplo.com',
    claims: {},
    documento: { rol: 'administrador', activo: true },
  });
  const escritoPorCliente = resolverAcceso({
    uid: 'persona-uid',
    correoAuth: 'persona@ejemplo.com',
    claims: {},
    documento: null,
    rol: 'administrador',
    activo: true,
  });

  assert.equal(porClaims.rol, 'administrador');
  assert.equal(porClaims.fuente, 'claims');
  assert.equal(destinoNavegacion({ cargando: false, usuario: porClaims }), 'administrador');
  assert.equal(porDocumento.fuente, 'firestore');
  assert.equal(escritoPorCliente.rol, null);
  assert.equal(
    destinoNavegacion({ cargando: false, usuario: escritoPorCliente }),
    'sin-permiso',
  );
});

test('F8 sin rol o inactivo no entra a pantallas protegidas', () => {
  const sinDocumento = resolverAcceso({
    uid: 'nuevo-uid',
    correoAuth: 'nuevo@ejemplo.com',
    nombreAuth: 'Nuevo',
    claims: {},
    documento: null,
  });
  const inactivo = resolverAcceso({
    uid: 'inactivo-uid',
    correoAuth: 'inactivo@ejemplo.com',
    claims: { rol: 'administrador', activo: false },
    documento: { rol: 'administrador', activo: true },
  });

  assert.equal(destinoNavegacion({ cargando: true, usuario: null }), 'cargando');
  assert.equal(destinoNavegacion({ cargando: false, usuario: sinDocumento }), 'sin-permiso');
  assert.equal(inactivo.rol, null);
  assert.equal(destinoNavegacion({ cargando: false, usuario: inactivo }), 'sin-permiso');
  assert.equal(sinDocumento.id, 'nuevo-uid');
  assert.equal(sinDocumento.correo, 'nuevo@ejemplo.com');
});

test('la propuesta de reglas no permite que el cliente se asigne el rol', () => {
  const reglas = readFileSync(join(raiz, 'firestore.rules'), 'utf8');

  assert.match(reglas, /allow read: if firmado\(\) && \(request\.auth\.uid == uid \|\| esAdmin\(\)\)/);
  assert.match(reglas, /allow create, update: if esAdmin\(\) && perfilValido\(\)/);
  assert.match(reglas, /resource\.data\.groomerUid == request\.auth\.uid/);
  assert.match(reglas, /allow read, write: if false/);
  assert.doesNotMatch(reglas, /request\.resource\.data\.rol == ['"]administrador['"]\s*\|\|\s*true/);
});
