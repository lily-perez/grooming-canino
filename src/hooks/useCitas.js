"use client";

import { useCallback, useEffect, useState } from "react";
import { citasRepository } from "@/repositories/citasRepository";

export function useCitas() {
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState(null);

  const cargarCitas = useCallback(async () => {
    setCargando(true);
    setError(null);

    try {
      const datos = await citasRepository.listar();
      setCitas(datos);
    } catch (errorPeticion) {
      setError(errorPeticion);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    let activo = true;

    citasRepository
      .listar()
      .then((datos) => {
        if (activo) {
          setCitas(datos);
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

  const crearCita = useCallback(async (datos) => {
    setProcesando(true);
    setError(null);

    try {
      const nuevaCita = await citasRepository.crear(datos);

      setCitas((actuales) => [...actuales, nuevaCita]);

      return nuevaCita;
    } catch (errorPeticion) {
      setError(errorPeticion);
      throw errorPeticion;
    } finally {
      setProcesando(false);
    }
  }, []);

  const actualizarCita = useCallback(async (id, datos) => {
    setProcesando(true);
    setError(null);

    try {
      const citaActualizada = await citasRepository.actualizar(id, datos);

      setCitas((actuales) =>
        actuales.map((cita) =>
          String(cita.id) === String(id) ? citaActualizada : cita,
        ),
      );

      return citaActualizada;
    } catch (errorPeticion) {
      setError(errorPeticion);
      throw errorPeticion;
    } finally {
      setProcesando(false);
    }
  }, []);

  const eliminarCita = useCallback(async (id) => {
    setProcesando(true);
    setError(null);

    try {
      await citasRepository.eliminar(id);

      setCitas((actuales) =>
        actuales.filter((cita) => String(cita.id) !== String(id)),
      );
    } catch (errorPeticion) {
      setError(errorPeticion);
      throw errorPeticion;
    } finally {
      setProcesando(false);
    }
  }, []);

  return {
    citas,
    cargando,
    procesando,
    error,
    cargarCitas,
    crearCita,
    actualizarCita,
    eliminarCita,
  };
}