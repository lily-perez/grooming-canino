"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  getServicios,
  createServicio,
  updateServicio,
  deleteServicio,
} from "@/services/servicios";
import {
  getTareas,
  createTarea,
  updateTarea,
  deleteTarea,
} from "@/services/tareas";
import { obtenerMensajeError } from "@/utils/errores";

const ServiciosContext = createContext();

export function ServiciosProvider({ children }) {
  const [servicios, setServicios] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function cargarTodo() {
    try {
      setLoading(true);
      const [dataServicios, dataTareas] = await Promise.all([
        getServicios(),
        getTareas(),
      ]);
      setServicios(dataServicios);
      setTareas(dataTareas);
      setError(null);
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarTodo();
  }, []);

  // --- Servicios ---
  async function agregarServicio(data) {
    const nuevo = await createServicio(data);
    setServicios((prev) => [...prev, nuevo]);
  }

  async function editarServicio(id, data) {
    const actualizado = await updateServicio(id, data);
    setServicios((prev) => prev.map((s) => (s.id === id ? actualizado : s)));
  }

  async function eliminarServicio(id) {
    await deleteServicio(id);
    setServicios((prev) => prev.filter((s) => s.id !== id));
  }

  // --- Tareas ---
  async function agregarTarea(data) {
    const nueva = await createTarea(data);
    setTareas((prev) => [...prev, nueva]);
  }

  async function editarTarea(id, data) {
    const actualizada = await updateTarea(id, data);
    setTareas((prev) => prev.map((t) => (t.id === id ? actualizada : t)));
  }

  async function eliminarTarea(id) {
    await deleteTarea(id);
    setTareas((prev) => prev.filter((t) => t.id !== id));
  }

  async function toggleTareaCompletada(tarea) {
    await editarTarea(tarea.id, { ...tarea, completada: !tarea.completada });
  }

  return (
    <ServiciosContext.Provider
      value={{
        servicios,
        tareas,
        loading,
        error,
        agregarServicio,
        editarServicio,
        eliminarServicio,
        agregarTarea,
        editarTarea,
        eliminarTarea,
        toggleTareaCompletada,
      }}
    >
      {children}
    </ServiciosContext.Provider>
  );
}

export function useServicios() {
  return useContext(ServiciosContext);
}