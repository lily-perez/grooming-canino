"use client";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { autenticacionRepository } from "@/repositories/autenticacionRepository";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const refrescarUsuario = useCallback(async () => {
    setCargando(true);

    try {
      const usuarioActual =
        await autenticacionRepository.obtenerUsuarioActual();
      setUsuario(usuarioActual);
      setError(null);
      return usuarioActual;
    } catch (errorPeticion) {
      setUsuario(null);

      if (errorPeticion.status !== 401) {
        setError(errorPeticion);
      } else {
        setError(null);
      }

      return null;
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    let activo = true;

    autenticacionRepository
      .obtenerUsuarioActual()
      .then((usuarioActual) => {
        if (activo) {
          setUsuario(usuarioActual);
          setError(null);
        }
      })
      .catch((errorPeticion) => {
        if (activo) {
          setUsuario(null);
          setError(errorPeticion.status === 401 ? null : errorPeticion);
        }
      })
      .finally(() => {
        if (activo) {
          setCargando(false);
        }
      });

    return () => {
      activo = false;
    };
  }, []);

  const login = useCallback(async (credenciales) => {
    setCargando(true);
    setError(null);

    try {
      const usuarioAutenticado =
        await autenticacionRepository.login(credenciales);
      setUsuario(usuarioAutenticado);
      return usuarioAutenticado;
    } catch (errorPeticion) {
      setError(errorPeticion);
      throw errorPeticion;
    } finally {
      setCargando(false);
    }
  }, []);

  const registrar = useCallback(async (datos) => {
    setCargando(true);
    setError(null);

    try {
      return await autenticacionRepository.registrar(datos);
    } catch (errorPeticion) {
      setError(errorPeticion);
      throw errorPeticion;
    } finally {
      setCargando(false);
    }
  }, []);

  const cerrarSesion = useCallback(async () => {
    setCargando(true);

    try {
      await autenticacionRepository.cerrarSesion();
    } finally {
      setUsuario(null);
      setError(null);
      setCargando(false);
    }
  }, []);

  const valor = useMemo(
    () => ({
      usuario,
      rol: usuario?.rol ?? null,
      cargando,
      autenticado: Boolean(usuario),
      error,
      login,
      registrar,
      cerrarSesion,
      refrescarUsuario,
    }),
    [
      usuario,
      cargando,
      error,
      login,
      registrar,
      cerrarSesion,
      refrescarUsuario,
    ],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
