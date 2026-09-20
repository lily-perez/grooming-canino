"use client";

import { useCallback, useEffect, useState } from "react";
import { historialRepository } from "@/repositories/historialRepository";

export function useHistorial(filtrosIniciales) {
  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState(null);

  const cargarHistorial = useCallback(
    async (filtros = filtrosIniciales) => {
      setCargando(true);
      setError(null);

      try {
        const datos = await historialRepository.listar(filtros);
        setRegistros(datos);
        return datos;
      } catch (errorPeticion) {
        setError(errorPeticion);
        throw errorPeticion;
      } finally {
        setCargando(false);
      }
    },
    [filtrosIniciales],
  );

  useEffect(() => {
    let activo = true;

    historialRepository
      .listar(filtrosIniciales)
      .then((datos) => {
        if (activo) {
          setRegistros(datos);
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
  }, [filtrosIniciales]);

  const actualizarRegistro = useCallback(async (id, datos) => {
    setProcesando(true);
    setError(null);

    try {
      const actualizado = await historialRepository.actualizar(id, datos);
      setRegistros((actuales) =>
        actuales.map((registro) =>
          String(registro.id) === String(id) ? actualizado : registro,
        ),
      );
      return actualizado;
    } catch (errorPeticion) {
      setError(errorPeticion);
      throw errorPeticion;
    } finally {
      setProcesando(false);
    }
  }, []);

  return {
    registros,
    cargando,
    procesando,
    error,
    cargarHistorial,
    actualizarRegistro,
  };
}
