"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { serviciosRepository } from "@/repositories/serviciosRepository";
import { tareasRepository } from "@/repositories/tareasRepository";
import { obtenerMensajeError } from "@/utils/errores";

const ServiciosContext = createContext();

export function ServiciosProvider({ children }) {
  const { rol } = useAuth();
  const [servicios, setServicios] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!rol) {
      return undefined;
    }

    let activo = true;
    const tareasPromise =
      rol === "administrador"
        ? tareasRepository.listar()
        : tareasRepository.listarMias();

    Promise.all([serviciosRepository.listar(), tareasPromise])
      .then(([dataServicios, dataTareas]) => {
        if (!activo) return;
        setServicios(dataServicios);
        setTareas(dataTareas);
        setError(null);
      })
      .catch((err) => {
        if (activo) {
          setError(obtenerMensajeError(err));
        }
      })
      .finally(() => {
        if (activo) {
          setLoading(false);
        }
      });

    return () => {
      activo = false;
    };
  }, [rol]);

  async function ejecutarOperacion(operacion) {
    try {
      setError(null);
      return await operacion();
    } catch (err) {
      setError(obtenerMensajeError(err));
      return null;
    }
  }

  async function agregarServicio(data) {
    const nuevo = await ejecutarOperacion(() =>
      serviciosRepository.crear(data),
    );
    if (!nuevo?.id) {
      if (nuevo) {
        setError("La API no devolvió el servicio creado correctamente.");
      }
      return false;
    }
    setServicios((prev) => [...prev, nuevo]);
    return true;
  }

  async function editarServicio(id, data) {
    const actualizado = await ejecutarOperacion(() =>
      serviciosRepository.actualizar(id, data),
    );
    if (!actualizado) return false;
    setServicios((prev) => prev.map((s) => (s.id === id ? actualizado : s)));
    return true;
  }

  async function cambiarEstadoServicio(id, activo) {
    const actualizado = await ejecutarOperacion(() =>
      serviciosRepository.cambiarEstado(id, activo),
    );
    if (!actualizado) return false;
    setServicios((prev) => prev.map((s) => (s.id === id ? actualizado : s)));
    return true;
  }

  async function agregarTarea(data) {
    const nueva = await ejecutarOperacion(() => tareasRepository.crear(data));
    if (!nueva) return false;
    setTareas((prev) => [...prev, nueva]);
    return true;
  }

  async function editarTarea(id, data) {
    const actualizada = await ejecutarOperacion(() =>
      tareasRepository.actualizar(id, data),
    );
    if (!actualizada) return false;
    setTareas((prev) => prev.map((t) => (t.id === id ? actualizada : t)));
    return true;
  }

  async function cambiarEstadoTarea(id, estado) {
    const actualizada = await ejecutarOperacion(() =>
      tareasRepository.cambiarEstado(id, estado),
    );
    if (!actualizada) return false;
    setTareas((prev) => prev.map((t) => (t.id === id ? actualizada : t)));
    return true;
  }

  return (
    <ServiciosContext.Provider
      value={{
        servicios,
        tareas,
        loading,
        error,
        limpiarError: () => setError(null),
        agregarServicio,
        editarServicio,
        cambiarEstadoServicio,
        agregarTarea,
        editarTarea,
        cambiarEstadoTarea,
      }}
    >
      {children}
    </ServiciosContext.Provider>
  );
}

export function useServicios() {
  return useContext(ServiciosContext);
}