"use client";

import { useCallback, useEffect, useState } from "react";
import { perrosRepository } from "@/repositories/perrosRepository";

export function usePerros(filtrosIniciales) {
  const [perros, setPerros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState(null);

  const cargarPerros = useCallback(async (filtros = filtrosIniciales) => {
    setCargando(true);
    setError(null);

    try {
      const datos = await perrosRepository.listar(filtros);
      setPerros(datos);
      return datos;
    } catch (errorPeticion) {
      setError(errorPeticion);
      throw errorPeticion;
    } finally {
      setCargando(false);
    }
  }, [filtrosIniciales]);

  useEffect(() => {
    let activo = true;

    perrosRepository
      .listar(filtrosIniciales)
      .then((datos) => {
        if (activo) {
          setPerros(datos);
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

  const crearPerro = useCallback(async (datos) => {
    setProcesando(true);
    setError(null);

    try {
      const nuevoPerro = await perrosRepository.crear(datos);

      if (!nuevoPerro?.id) {
        throw Object.assign(new Error("La API no devolvió el perro creado."), {
          codigo: "ERROR_RESPUESTA",
        });
      }

      setPerros((actuales) => [...actuales, nuevoPerro]);
      return nuevoPerro;
    } catch (errorPeticion) {
      setError(errorPeticion);
      throw errorPeticion;
    } finally {
      setProcesando(false);
    }
  }, []);

  const actualizarPerro = useCallback(async (id, datos) => {
    setProcesando(true);
    setError(null);

    try {
      const perroActualizado = await perrosRepository.actualizar(id, datos);
      setPerros((actuales) =>
        actuales.map((perro) =>
          String(perro.id) === String(id) ? perroActualizado : perro,
        ),
      );
      return perroActualizado;
    } catch (errorPeticion) {
      setError(errorPeticion);
      throw errorPeticion;
    } finally {
      setProcesando(false);
    }
  }, []);

  const cambiarEstadoPerro = useCallback(async (id, activo) => {
    setProcesando(true);
    setError(null);

    try {
      const perroActualizado = await perrosRepository.cambiarEstado(id, activo);
      setPerros((actuales) =>
        actuales.map((perro) =>
          String(perro.id) === String(id) ? perroActualizado : perro,
        ),
      );
      return perroActualizado;
    } catch (errorPeticion) {
      setError(errorPeticion);
      throw errorPeticion;
    } finally {
      setProcesando(false);
    }
  }, []);

  return {
    perros,
    cargando,
    procesando,
    error,
    cargarPerros,
    crearPerro,
    actualizarPerro,
    cambiarEstadoPerro,
  };
}
