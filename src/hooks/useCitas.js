"use client";

import { useCallback, useEffect, useState } from "react";
import { citasRepository } from "@/repositories/citasRepository";

export function useCitas() {
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState(null);

  const cargarCitas = useCallback(async (filtros) => {
    setCargando(true);
    setError(null);

    try {
      const datos = await citasRepository.listar(filtros);
      setCitas(datos);
      return datos;
    } catch (errorPeticion) {
      setError(errorPeticion);
      throw errorPeticion;
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

      if (!nuevaCita?.id) {
        throw Object.assign(new Error("La API no devolvió la cita creada."), {
          codigo: "ERROR_RESPUESTA",
        });
      }

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

  const cambiarEstadoCita = useCallback(async (id, estado) => {
    setProcesando(true);
    setError(null);

    try {
      const citaActualizada = await citasRepository.cambiarEstado(id, estado);
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

  const finalizarCita = useCallback(async (id, datos) => {
    setProcesando(true);
    setError(null);

    try {
      const resultado = await citasRepository.finalizar(id, datos);
      const citaActualizada = resultado?.cita;

      if (!citaActualizada?.id) {
        throw Object.assign(
          new Error("La API no devolvió la cita finalizada."),
          { codigo: "ERROR_RESPUESTA" },
        );
      }

      setCitas((actuales) =>
        actuales.map((cita) =>
          String(cita.id) === String(id) ? citaActualizada : cita,
        ),
      );
      return resultado;
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
    cambiarEstadoCita,
    finalizarCita,
  };
}
