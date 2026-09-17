"use client";

import { useCallback, useEffect, useState } from "react";
import { usuariosRepository } from "@/repositories/usuariosRepository";

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarUsuarios = useCallback(async () => {
    setCargando(true);
    setError(null);

    try {
      setUsuarios(await usuariosRepository.listar());
    } catch (errorPeticion) {
      setError(errorPeticion);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    let activo = true;

    usuariosRepository
      .listar()
      .then((datos) => {
        if (activo) {
          setUsuarios(datos);
        }
      })
      .catch((errorPeticion) => {
        if (activo) {
          setError(errorPeticion);
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

  const actualizarUsuario = useCallback(async (id, datos) => {
    const usuario = await usuariosRepository.actualizar(id, datos);
    setUsuarios((actuales) =>
      actuales.map((actual) => (actual.id === id ? usuario : actual)),
    );
    return usuario;
  }, []);

  const cambiarEstado = useCallback(async (id, activo) => {
    const usuario = await usuariosRepository.cambiarEstado(id, activo);
    setUsuarios((actuales) =>
      actuales.map((actual) => (actual.id === id ? usuario : actual)),
    );
    return usuario;
  }, []);

  return {
    usuarios,
    cargando,
    error,
    cargarUsuarios,
    actualizarUsuario,
    cambiarEstado,
  };
}
