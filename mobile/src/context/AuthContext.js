import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import {
  cerrarSesionApi,
  iniciarSesionApi,
  obtenerUsuarioActual,
} from '../services/authService';
import { registrarPerdidaDeSesion } from '../services/apiClient';

const AuthContext = createContext(null);

const ROLES_PERMITIDOS = ['administrador', 'groomer'];

function esUsuarioPermitido(usuario) {
  return (
    Boolean(usuario) &&
    usuario.activo === true &&
    ROLES_PERMITIDOS.includes(usuario.rol)
  );
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [aviso, setAviso] = useState('');
  const usuarioRef = useRef(null);

  const guardarUsuario = useCallback((valor) => {
    usuarioRef.current = valor;
    setUsuario(valor);
  }, []);

  useEffect(() => {
    return registrarPerdidaDeSesion(() => {
      if (usuarioRef.current) {
        setAviso('Tu sesión ya no es válida. Vuelve a iniciar sesión.');
      }

      guardarUsuario(null);
    });
  }, [guardarUsuario]);

  // Al abrir la app, intenta recuperar la sesión guardada en la cookie.
  useEffect(() => {
    let activo = true;

    obtenerUsuarioActual()
      .then(async (u) => {
        if (!activo) {
          return;
        }

        if (esUsuarioPermitido(u)) {
          guardarUsuario(u);
          return;
        }

        if (u) {
          await cerrarSesionApi();
        }
      })
      .catch((error) => {
        if (!activo) {
          return;
        }

        guardarUsuario(null);
        setAviso(
          error?.status === 0
            ? 'No se pudo conectar con el servidor.'
            : error?.message || 'No se pudo comprobar la sesión.',
        );
      })
      .finally(() => {
        if (activo) {
          setCargando(false);
        }
      });

    return () => {
      activo = false;
    };
  }, [guardarUsuario]);

  const iniciarSesion = useCallback(async (correo, contrasena) => {
    setAviso('');
    const u = await iniciarSesionApi(correo.trim(), contrasena);

    if (!esUsuarioPermitido(u)) {
      await cerrarSesionApi();

      if (!u) {
        throw new Error('No se pudo iniciar sesión.');
      }

      if (u.activo !== true) {
        throw new Error('La cuenta se encuentra inactiva.');
      }

      throw new Error(
        'Tu cuenta no tiene un rol autorizado para esta aplicación.',
      );
    }

    guardarUsuario(u);
  }, [guardarUsuario]);

  const cerrarSesion = useCallback(async () => {
    const confirmado = await cerrarSesionApi();

    guardarUsuario(null);
    setAviso(
      confirmado
        ? ''
        : 'Se cerró la sesión en este dispositivo, pero no se pudo confirmar el cierre en el servidor.',
    );
  }, [guardarUsuario]);

  const value = useMemo(
    () => ({ usuario, cargando, aviso, iniciarSesion, cerrarSesion }),
    [usuario, cargando, aviso, iniciarSesion, cerrarSesion],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return ctx;
}