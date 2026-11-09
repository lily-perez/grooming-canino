import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from '../config/sdkAuth';
import { reducirSesion, resolverAcceso } from '../domain/acceso.mjs';
import { cerrarSesionFirebase, iniciarSesionCorreo } from '../services/authService';
import { iniciarSesionConGoogle as entrarConGoogleFirebase } from '../services/googleAuth';
import { leerDocumentoUsuario } from '../services/perfilUsuario';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [estado, setEstado] = useState(() =>
    reducirSesion(
      { usuario: null, cargando: true, aviso: '' },
      { tipo: 'inicio' },
    ),
  );

  const aplicar = useCallback((evento) => {
    setEstado((previo) => reducirSesion(previo, evento));
  }, []);

  useEffect(() => {
    let generacion = 0;

    const cancelar = onAuthStateChanged(auth, (user) => {
      const actual = ++generacion;

      if (!user) {
        aplicar({ tipo: 'sin-usuario' });
        return;
      }

      aplicar({ tipo: 'verificando' });

      Promise.all([leerDocumentoUsuario(user.uid), user.getIdTokenResult()])
        .then(([documento, token]) => {
          if (actual !== generacion) {
            return;
          }

          const usuario = resolverAcceso({
            uid: user.uid,
            correoAuth: user.email,
            nombreAuth: user.displayName,
            claims: token?.claims ?? {},
            documento,
          });

          aplicar({
            tipo: 'perfil',
            usuario,
            aviso: usuario.rol ? '' : 'Tu cuenta no tiene un rol activo.',
          });
        })
        .catch(() => {
          if (actual !== generacion) {
            return;
          }

          aplicar({
            tipo: 'perfil',
            usuario: resolverAcceso({
              uid: user.uid,
              correoAuth: user.email,
              nombreAuth: user.displayName,
              claims: {},
              documento: null,
            }),
            aviso: 'No se pudo verificar el rol. No se concedió acceso.',
          });
        });
    });

    return () => {
      generacion += 1;
      cancelar();
    };
  }, [aplicar]);

  const iniciarSesion = useCallback(async (correo, contrasena) => {
    aplicar({ tipo: 'aviso', aviso: '' });
    await iniciarSesionCorreo(correo, contrasena);
  }, [aplicar]);

  const iniciarSesionConGoogle = useCallback(async () => {
    aplicar({ tipo: 'aviso', aviso: '' });
    await entrarConGoogleFirebase();
  }, [aplicar]);

  const cerrarSesion = useCallback(async () => {
    await cerrarSesionFirebase();
    aplicar({ tipo: 'aviso', aviso: '' });
  }, [aplicar]);

  const value = useMemo(() => {
    const usuario = estado.usuario;

    return {
      usuario,
      uid: usuario?.uid ?? null,
      correo: usuario?.correo ?? '',
      rol: usuario?.rol ?? null,
      activo: usuario?.activo === true,
      cargando: estado.cargando,
      aviso: estado.aviso,
      iniciarSesion,
      iniciarSesionConGoogle,
      cerrarSesion,
    };
  }, [estado, iniciarSesion, iniciarSesionConGoogle, cerrarSesion]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }

  return ctx;
}
