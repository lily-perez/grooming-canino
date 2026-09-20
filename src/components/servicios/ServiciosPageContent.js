"use client";

import { useMemo, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCitas } from "@/hooks/useCitas";
import { useServicios } from "@/context/ServiciosContext";
import ServicioForm from "@/components/ServicioForm";
import TareaForm from "@/components/TareaForm";
import ServiciosGrid from "@/components/ServiciosGrid";
import TareasBreakdown from "@/components/TareasBreakdown";
import Modal from "@/components/Modal";
import RegistroAtencionForm, {
  FORMULARIO_OBSERVACION_INICIAL,
} from "@/components/historial/RegistroAtencionForm";
import { IconSearch, IconPlus } from "@/components/icons";
import { obtenerMensajeError } from "@/utils/errores";

export default function ServiciosPageContent() {
  const { rol } = useAuth();
  const esAdmin = rol === "administrador";

  const {
    servicios,
    tareas,
    loading,
    error,
    limpiarError,
    agregarServicio,
    editarServicio,
    cambiarEstadoServicio,
    agregarTarea,
    editarTarea,
    cambiarEstadoTarea,
  } = useServicios();
  const { citas, procesando, error: errorCitas, finalizarCita } = useCitas();

  const [tab, setTab] = useState("servicios");
  const [busqueda, setBusqueda] = useState("");

  const [servicioEnEdicion, setServicioEnEdicion] = useState(null);
  const [tareaEnEdicion, setTareaEnEdicion] = useState(null);
  const [modalServicioAbierto, setModalServicioAbierto] = useState(false);
  const [modalTareaAbierto, setModalTareaAbierto] = useState(false);
  const [guardandoServicio, setGuardandoServicio] = useState(false);
  const [citaAFinalizar, setCitaAFinalizar] = useState(null);
  const [formularioFinalizar, setFormularioFinalizar] = useState(
    FORMULARIO_OBSERVACION_INICIAL,
  );
  const [mensajeExitoFinalizar, setMensajeExitoFinalizar] = useState("");
  const guardandoServicioRef = useRef(false);

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

  const citasPorFinalizar = useMemo(() => {
    const porId = new Map(citas.map((cita) => [String(cita.id), cita]));
    const vistas = [];

    for (const cita of porId.values()) {
      if (cita.estado !== "en_proceso") {
        continue;
      }

      const relacionadas = tareas.filter(
        (tarea) => String(tarea.citaId) === String(cita.id),
      );

      if (
        relacionadas.length > 0 &&
        relacionadas.every((tarea) => tarea.estado === "completada")
      ) {
        vistas.push(cita);
      }
    }

    return vistas;
  }, [citas, tareas]);

  function abrirNuevoServicio() {
    if (!esAdmin) return;
    limpiarError();
    setServicioEnEdicion(null);
    setModalServicioAbierto(true);
  }

  function abrirEditarServicio(servicio) {
    if (!esAdmin) return;
    limpiarError();
    setServicioEnEdicion(servicio);
    setModalServicioAbierto(true);
  }

  async function handleSubmitServicio(data) {
    if (!esAdmin || guardandoServicioRef.current) return false;

    guardandoServicioRef.current = true;
    setGuardandoServicio(true);

    try {
      const guardado = servicioEnEdicion
        ? await editarServicio(servicioEnEdicion.id, data)
        : await agregarServicio(data);
      if (!guardado) return false;
      setModalServicioAbierto(false);
      setServicioEnEdicion(null);
      return true;
    } finally {
      guardandoServicioRef.current = false;
      setGuardandoServicio(false);
    }
  }

  function cerrarModalServicio() {
    if (guardandoServicioRef.current) return;
    setModalServicioAbierto(false);
    setServicioEnEdicion(null);
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

  function abrirFinalizar(cita) {
    setCitaAFinalizar(cita);
    setFormularioFinalizar({ ...FORMULARIO_OBSERVACION_INICIAL });
    setMensajeExitoFinalizar("");
  }

  function cerrarFinalizar() {
    if (procesando) {
      return;
    }

    setCitaAFinalizar(null);
    setFormularioFinalizar({ ...FORMULARIO_OBSERVACION_INICIAL });
  }

  async function manejarFinalizar(event) {
    event.preventDefault();

    if (!citaAFinalizar) {
      return;
    }

    try {
      const resultado = await finalizarCita(
        citaAFinalizar.id,
        formularioFinalizar,
      );

      if (!resultado?.cita) {
        return;
      }

      setCitaAFinalizar(null);
      setFormularioFinalizar({ ...FORMULARIO_OBSERVACION_INICIAL });
      setMensajeExitoFinalizar("Cita finalizada correctamente.");
    } catch {
      // El hook conserva el error.
    }
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

      {errorCitas ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-5 py-4 rounded-xl max-w-xl">
          {obtenerMensajeError(errorCitas)}
        </div>
      ) : null}

      {mensajeExitoFinalizar ? (
        <div
          role="status"
          className="rounded-xl border border-green-400 bg-green-100 p-4 text-sm text-green-700 max-w-xl"
        >
          {mensajeExitoFinalizar}
        </div>
      ) : null}

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

          {citasPorFinalizar.length > 0 ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-slate-800">
                Citas listas para finalizar
              </h3>
              <p className="mt-1 mb-3 text-xs text-slate-500">
                Todas las tareas visibles de estas citas están completadas.
              </p>
              <ul className="space-y-2">
                {citasPorFinalizar.map((cita) => (
                  <li
                    key={cita.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 px-3 py-2"
                  >
                    <span className="text-sm text-slate-700">
                      {cita.fecha} · {cita.horaInicio} - {cita.horaFinEstimada}
                    </span>
                    <button
                      type="button"
                      disabled={procesando}
                      onClick={() => abrirFinalizar(cita)}
                      className="rounded-lg bg-sky-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-800 disabled:opacity-60"
                    >
                      Finalizar cita
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}

      {esAdmin && (
        <>
          <Modal open={modalServicioAbierto} onClose={cerrarModalServicio}>
            <ServicioForm
              key={servicioEnEdicion?.id || "nuevo-servicio"}
              onSubmit={handleSubmitServicio}
              servicioInicial={servicioEnEdicion}
              onCancel={cerrarModalServicio}
              enviando={guardandoServicio}
              errorServidor={error}
            />
          </Modal>

          <Modal open={modalTareaAbierto} onClose={() => setModalTareaAbierto(false)}>
            <TareaForm
              key={tareaEnEdicion?.id || "nueva-tarea"}
              servicios={servicios.filter((servicio) => servicio.activo)}
              citas={citas}
              onSubmit={handleSubmitTarea}
              tareaInicial={tareaEnEdicion}
              onCancel={() => setModalTareaAbierto(false)}
            />
          </Modal>
        </>
      )}

      <Modal open={Boolean(citaAFinalizar)} onClose={cerrarFinalizar}>
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Finalizar cita</h2>
          <p className="mt-1 mb-4 text-sm text-slate-600">
            Registra las observaciones de la atención. Todos los campos son opcionales.
          </p>
          <RegistroAtencionForm
            formulario={formularioFinalizar}
            erroresCampos={errorCitas?.erroresCampos || {}}
            guardando={procesando}
            textoAccion="Finalizar cita"
            onChange={setFormularioFinalizar}
            onSubmit={manejarFinalizar}
            onCancel={cerrarFinalizar}
          />
        </div>
      </Modal>
    </div>
  );
}