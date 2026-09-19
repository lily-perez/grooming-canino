"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useServicios } from "@/context/ServiciosContext";
import ServicioForm from "@/components/ServicioForm";
import TareaForm from "@/components/TareaForm";
import ServiciosGrid from "@/components/ServiciosGrid";
import TareasBreakdown from "@/components/TareasBreakdown";
import Modal from "@/components/Modal";
import { IconSearch, IconPlus } from "@/components/icons";

export default function ServiciosPageContent() {
  const { rol } = useAuth();
  const esAdmin = rol === "administrador";

  const {
    servicios,
    tareas,
    loading,
    error,
    agregarServicio,
    editarServicio,
    cambiarEstadoServicio,
    agregarTarea,
    editarTarea,
    cambiarEstadoTarea,
  } = useServicios();

  const [tab, setTab] = useState("servicios");
  const [busqueda, setBusqueda] = useState("");

  const [servicioEnEdicion, setServicioEnEdicion] = useState(null);
  const [tareaEnEdicion, setTareaEnEdicion] = useState(null);
  const [modalServicioAbierto, setModalServicioAbierto] = useState(false);
  const [modalTareaAbierto, setModalTareaAbierto] = useState(false);

  const serviciosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return servicios;
    return servicios.filter(
      (s) =>
        s.nombre.toLowerCase().includes(q) ||
        (s.descripcion || "").toLowerCase().includes(q),
    );
  }, [servicios, busqueda]);

  const tareasFiltradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return tareas;
    return tareas.filter((t) => t.nombre.toLowerCase().includes(q));
  }, [tareas, busqueda]);

  function abrirNuevoServicio() {
    if (!esAdmin) return;
    setServicioEnEdicion(null);
    setModalServicioAbierto(true);
  }

  function abrirEditarServicio(servicio) {
    if (!esAdmin) return;
    setServicioEnEdicion(servicio);
    setModalServicioAbierto(true);
  }

  async function handleSubmitServicio(data) {
    if (!esAdmin) return false;
    const guardado = servicioEnEdicion
      ? await editarServicio(servicioEnEdicion.id, data)
      : await agregarServicio(data);
    if (!guardado) return false;
    setModalServicioAbierto(false);
    setServicioEnEdicion(null);
    return true;
  }

  async function handleCambiarEstadoServicio(servicio) {
    if (!esAdmin) return;
    const accion = servicio.activo ? "desactivar" : "activar";
    if (confirm(`¿Deseas ${accion} este servicio?`)) {
      await cambiarEstadoServicio(servicio.id, !servicio.activo);
    }
  }

  function abrirNuevaTarea() {
    if (!esAdmin) return;
    setTareaEnEdicion(null);
    setModalTareaAbierto(true);
  }

  function abrirEditarTarea(tarea) {
    if (!esAdmin) return;
    setTareaEnEdicion(tarea);
    setModalTareaAbierto(true);
  }

  async function handleSubmitTarea(data) {
    if (!esAdmin) return false;
    const guardada = tareaEnEdicion
      ? await editarTarea(tareaEnEdicion.id, data)
      : await agregarTarea(data);
    if (!guardada) return false;
    setModalTareaAbierto(false);
    setTareaEnEdicion(null);
    return true;
  }

  async function handleCambiarEstadoTarea(tarea) {
    const estado =
      tarea.estado === "pendiente" ? "en_proceso" : "completada";
    await cambiarEstadoTarea(tarea.id, estado);
  }

  if (loading) {
    return <p className="text-slate-500">Cargando servicios y tareas...</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-medium tracking-wide text-sky-700 uppercase">
          {esAdmin ? "Administración" : "Consulta"}
        </p>
        <h1 className="text-2xl font-semibold text-slate-900 mt-1">Servicios y tareas</h1>
        <p className="text-sm text-slate-500 mt-1 max-w-lg">
          {esAdmin
            ? "Administra el catálogo de servicios y las tareas operativas."
            : "Consulta el catálogo y tus tareas asignadas."}
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-5 py-4 rounded-xl max-w-xl">
          {error}
        </div>
      )}

      {!esAdmin && (
        <div className="bg-sky-50 border border-sky-200 text-sky-700 text-sm rounded-xl px-4 py-2.5">
          Estás viendo este módulo en modo solo lectura.
        </div>
      )}

      <div className="relative w-full max-w-sm">
        <IconSearch className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar servicios o tareas..."
          className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/15 transition"
        />
      </div>

      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex gap-6">
          <button
            onClick={() => setTab("servicios")}
            className={`pb-3 text-sm font-medium border-b-2 -mb-px transition ${
              tab === "servicios"
                ? "border-sky-700 text-sky-700"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Servicios
          </button>
          <button
            onClick={() => setTab("tareas")}
            className={`pb-3 text-sm font-medium border-b-2 -mb-px transition ${
              tab === "tareas"
                ? "border-sky-700 text-sky-700"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Tareas
          </button>
        </div>

        {esAdmin && (
          <button
            onClick={tab === "servicios" ? abrirNuevoServicio : abrirNuevaTarea}
            className="flex items-center gap-1.5 bg-sky-700 hover:bg-sky-800 text-white text-sm font-medium px-3.5 py-2 rounded-lg mb-2 transition"
          >
            <IconPlus className="w-4 h-4" />
            {tab === "servicios" ? "Nuevo servicio" : "Nueva tarea"}
          </button>
        )}
      </div>

      {tab === "servicios" ? (
        <ServiciosGrid
          servicios={serviciosFiltrados}
          onEditar={abrirEditarServicio}
          onCambiarEstado={handleCambiarEstadoServicio}
          soloLectura={!esAdmin}
        />
      ) : (
        <div>
          <h2 className="text-base font-semibold text-slate-800 mb-1">Desglose de tareas</h2>
          <p className="text-sm text-slate-400 mb-4">
            Tareas operativas asociadas a una cita, un servicio y un Groomer.
          </p>
          <TareasBreakdown
            tareas={tareasFiltradas}
            servicios={servicios}
            onEditar={abrirEditarTarea}
            onCambiarEstado={handleCambiarEstadoTarea}
            puedeEditar={esAdmin}
            puedeCambiarEstado
          />
        </div>
      )}

      {esAdmin && (
        <>
          <Modal open={modalServicioAbierto} onClose={() => setModalServicioAbierto(false)}>
            <ServicioForm
              key={servicioEnEdicion?.id || "nuevo-servicio"}
              onSubmit={handleSubmitServicio}
              servicioInicial={servicioEnEdicion}
              onCancel={() => setModalServicioAbierto(false)}
            />
          </Modal>

          <Modal open={modalTareaAbierto} onClose={() => setModalTareaAbierto(false)}>
            <TareaForm
              key={tareaEnEdicion?.id || "nueva-tarea"}
              servicios={servicios.filter((servicio) => servicio.activo)}
              onSubmit={handleSubmitTarea}
              tareaInicial={tareaEnEdicion}
              onCancel={() => setModalTareaAbierto(false)}
            />
          </Modal>
        </>
      )}
    </div>
  );
}