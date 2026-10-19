import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import {
  cerrarSesionApi,
  iniciarSesionApi,
  obtenerUsuarioActual,
} from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Al abrir la app, intenta recuperar la sesión guardada en la cookie.
  useEffect(() => {
    let activo = true;

    obtenerUsuarioActual()
      .then((u) => {
        if (activo && u?.rol === 'groomer') {
          setUsuario(u);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (activo) {
          setCargando(false);
        }
      });

    return () => {
      activo = false;
    };
  }, []);

  const iniciarSesion = useCallback(async (correo, contrasena) => {
    const u = await iniciarSesionApi(correo.trim(), contrasena);

    if (u?.rol !== 'groomer') {
      await cerrarSesionApi();
      throw new Error('Esta aplicación es solo para Groomers.');
    }

    setUsuario(u);
  }, []);

  const cerrarSesion = useCallback(async () => {
    await cerrarSesionApi();
    setUsuario(null);
  }, []);

  const value = useMemo(
    () => ({ usuario, cargando, iniciarSesion, cerrarSesion }),
    [usuario, cargando, iniciarSesion, cerrarSesion],
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