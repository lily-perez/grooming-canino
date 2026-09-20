"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCitas } from "@/hooks/useCitas";
import { useClientes } from "@/hooks/useClientes";
import { usePerros } from "@/hooks/usePerros";
import Modal from "@/components/Modal";
import RegistroAtencionForm, {
  FORMULARIO_OBSERVACION_INICIAL,
} from "@/components/historial/RegistroAtencionForm";
import { serviciosRepository } from "@/repositories/serviciosRepository";
import { tareasRepository } from "@/repositories/tareasRepository";
import { disponibilidadRepository } from "@/repositories/disponibilidadRepository";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { obtenerMensajeError } from "@/utils/errores";
import { calcularHoraFinEstimada } from "@/utils/validacionesCitas";

const FORMULARIO_INICIAL = {
  perroId: "",
  servicioIds: [],
  fecha: "",
  horaInicio: "",
  observaciones: "",
};

export default function GestionCitas({ perroIdInicial = "" }) {
  const [formulario, setFormulario] = useState({
    ...FORMULARIO_INICIAL,
    perroId: perroIdInicial,
  });
  const [clienteId, setClienteId] = useState("");
  const [citaEnEdicion, setCitaEnEdicion] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [consultaDisponibilidad, setConsultaDisponibilidad] = useState({
    fecha: "",
    horaInicio: "",
    horaFin: "",
  });
  const [groomersDisponibles, setGroomersDisponibles] = useState([]);
  const [errorDisponibilidad, setErrorDisponibilidad] = useState(null);
  const [consultandoDisponibilidad, setConsultandoDisponibilidad] = useState(false);
  const [tareas, setTareas] = useState([]);
  const [citaAFinalizar, setCitaAFinalizar] = useState(null);
  const [formularioFinalizar, setFormularioFinalizar] = useState(
    FORMULARIO_OBSERVACION_INICIAL,
  );
  const [mensajeExito, setMensajeExito] = useState("");
  const [registroCreadoId, setRegistroCreadoId] = useState("");

  const {
    citas,
    cargando,
    procesando,
    error,
    crearCita,
    actualizarCita,
    cambiarEstadoCita,
    finalizarCita,
  } = useCitas();
  const { clientes } = useClientes();
  const { perros } = usePerros();

  useEffect(() => {
    let activo = true;

    serviciosRepository
      .listar()
      .then((data) => {
        if (activo) {
          setServicios(data.filter((servicio) => servicio.activo));
        }
      })
      .catch(() => {
        if (activo) {
          setServicios([]);
        }
      });

    return () => {
      activo = false;
    };
  }, []);

  useEffect(() => {
    let activo = true;

    tareasRepository
      .listar()
      .then((data) => {
        if (activo) {
          setTareas(data);
        }
      })
      .catch(() => {
        if (activo) {
          setTareas([]);
        }
      });

    return () => {
      activo = false;
    };
  }, []);

  const serviciosSeleccionados = useMemo(
    () =>
      servicios.filter((servicio) =>
        formulario.servicioIds.includes(String(servicio.id)),
      ),
    [servicios, formulario.servicioIds],
  );

  const horaFinEstimada = calcularHoraFinEstimada(
    formulario.horaInicio,
    serviciosSeleccionados,
  );

  const citasFiltradas = useMemo(
    () =>
      citas.filter((cita) => {
        if (filtroFecha && cita.fecha !== filtroFecha) {
          return false;
        }

        if (filtroEstado && cita.estado !== filtroEstado) {
          return false;
        }

        return true;
      }),
    [citas, filtroFecha, filtroEstado],
  );

  const perrosPorId = useMemo(
    () => new Map(perros.map((perro) => [String(perro.id), perro])),
    [perros],
  );
  const clientesPorId = useMemo(
    () => new Map(clientes.map((cliente) => [String(cliente.id), cliente])),
    [clientes],
  );
  const perroSeleccionado = perrosPorId.get(String(formulario.perroId));
  const clienteSeleccionadoId = clienteId || perroSeleccionado?.clienteId || "";
  const perrosDelCliente = perros.filter((perro) => {
    if (String(perro.clienteId) !== String(clienteSeleccionadoId)) {
      return false;
    }

    return perro.activo || String(perro.id) === String(formulario.perroId);
  });
  const clientesParaCita = clientes.filter(
    (cliente) =>
      cliente.activo || String(cliente.id) === String(clienteSeleccionadoId),
  );

  function etiquetaPerro(perroId) {
    const perro = perrosPorId.get(String(perroId));

    if (!perro) {
      return `Referencia histórica: ${perroId}`;
    }

    const cliente = clientesPorId.get(String(perro.clienteId));
    return cliente ? `${perro.nombre} · ${cliente.nombre}` : perro.nombre;
  }

  function citaPuedeFinalizarse(cita) {
    if (cita.estado !== "en_proceso") {
      return false;
    }

    const relacionadas = tareas.filter(
      (tarea) => String(tarea.citaId) === String(cita.id),
    );

    return (
      relacionadas.length > 0 &&
      relacionadas.every((tarea) => tarea.estado === "completada")
    );
  }

  function abrirFinalizar(cita) {
    setCitaAFinalizar(cita);
    setFormularioFinalizar({ ...FORMULARIO_OBSERVACION_INICIAL });
    setMensajeExito("");
    setRegistroCreadoId("");
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
      setCitaAFinalizar(null);
      setFormularioFinalizar({ ...FORMULARIO_OBSERVACION_INICIAL });
      setRegistroCreadoId(resultado?.registroAtencion?.id || "");
      setMensajeExito("Cita finalizada correctamente.");
    } catch {
      // El hook ya almacena el error.
    }
  }

  function manejarCambio(event) {
    const { name, value } = event.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
  }

  function alternarServicio(servicioId) {
    const id = String(servicioId);
    setFormulario((actual) => {
      const seleccionado = actual.servicioIds.includes(id);
      return {
        ...actual,
        servicioIds: seleccionado
          ? actual.servicioIds.filter((item) => item !== id)
          : [...actual.servicioIds, id],
      };
    });
  }

  function iniciarEdicion(cita) {
    const perro = perrosPorId.get(String(cita.perroId));
    setCitaEnEdicion(cita);
    setClienteId(perro?.clienteId || "");
    setFormulario({
      perroId: cita.perroId,
      servicioIds: (cita.servicioIds || []).map(String),
      fecha: cita.fecha,
      horaInicio: cita.horaInicio,
      observaciones: cita.observaciones || "",
    });
  }

  function limpiarFormulario() {
    setCitaEnEdicion(null);
    setClienteId("");
    setFormulario(FORMULARIO_INICIAL);
  }

  function manejarCambioCliente(event) {
    setClienteId(event.target.value);
    setFormulario((actual) => ({ ...actual, perroId: "" }));
  }

  async function manejarSubmit(event) {
    event.preventDefault();
    const payload = {
      ...formulario,
      horaFinEstimada,
    };

    try {
      if (citaEnEdicion) {
        await actualizarCita(citaEnEdicion.id, payload);
      } else {
        await crearCita(payload);
      }
      limpiarFormulario();
    } catch {
      // El hook ya almacena el error.
    }
  }

  async function manejarCancelar(cita) {
    if (cita.estado !== "programada") {
      return;
    }

    if (!window.confirm("¿Deseas cancelar esta cita programada?")) {
      return;
    }

    try {
      await cambiarEstadoCita(cita.id, "cancelada");
    } catch {
      // El hook ya maneja el error.
    }
  }

  async function consultarDisponibilidad(event) {
    event.preventDefault();
    setConsultandoDisponibilidad(true);
    setErrorDisponibilidad(null);

    try {
      const disponibles = await disponibilidadRepository.listarGroomers(
        consultaDisponibilidad,
      );
      setGroomersDisponibles(disponibles);
    } catch (errorConsulta) {
      setGroomersDisponibles([]);
      setErrorDisponibilidad(errorConsulta);
    } finally {
      setConsultandoDisponibilidad(false);
    }
  }

  const erroresCampos = error?.erroresCampos || {};
  const erroresDisponibilidad = errorDisponibilidad?.erroresCampos || {};

  return (
    <div className="space-y-6">
      {mensajeExito ? (
        <div
          role="status"
          className="rounded-md border border-green-400 bg-green-100 p-4 text-sm text-green-700"
        >
          {mensajeExito}
          {registroCreadoId ? (
            <>
              {" "}
              <Link
                href={`/admin/historial/${registroCreadoId}`}
                className="font-medium underline"
              >
                Ver registro de atención
              </Link>
            </>
          ) : null}
        </div>
      ) : null}
      {error ? (
        <ErrorMessage mensaje={obtenerMensajeError(error)} />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <div className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-slate-900">
                {citaEnEdicion ? "Editar cita programada" : "Nueva cita"}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                La Cita no asigna Groomer. La asignación se hace en las Tareas.
              </p>
            </div>

            <form className="space-y-4" onSubmit={manejarSubmit}>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Cliente
                </label>
                <select
                  value={clienteSeleccionadoId}
                  onChange={manejarCambioCliente}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500"
                >
                  <option value="">Selecciona un cliente</option>
                  {clientesParaCita.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Perro
                </label>
                <select
                  name="perroId"
                  value={formulario.perroId}
                  onChange={manejarCambio}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500"
                >
                  <option value="">Selecciona un perro</option>
                  {perroSeleccionado || !formulario.perroId ? null : (
                    <option value={formulario.perroId}>
                      Referencia histórica no registrada
                    </option>
                  )}
                  {perrosDelCliente.map((perro) => (
                    <option key={perro.id} value={perro.id}>
                      {perro.nombre}
                      {perro.activo ? "" : " (inactivo)"}
                    </option>
                  ))}
                </select>
                {erroresCampos.perroId ? (
                  <p className="mt-1 text-sm text-red-600">{erroresCampos.perroId}</p>
                ) : (
                  <p className="mt-1 text-xs text-slate-500">
                    Solo se puede crear una cita con un perro activo de un cliente activo.
                  </p>
                )}
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">Servicios</p>
                <div className="space-y-2 rounded-lg border border-slate-200 p-3">
                  {servicios.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      No hay servicios activos para seleccionar.
                    </p>
                  ) : (
                    servicios.map((servicio) => (
                      <label key={servicio.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formulario.servicioIds.includes(String(servicio.id))}
                          onChange={() => alternarServicio(servicio.id)}
                        />
                        <span>
                          {servicio.nombre} · {servicio.duracionEstimadaMinutos} min
                        </span>
                      </label>
                    ))
                  )}
                </div>
                {erroresCampos.servicioIds ? (
                  <p className="mt-1 text-sm text-red-600">{erroresCampos.servicioIds}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Fecha
                </label>
                <input
                  type="date"
                  name="fecha"
                  value={formulario.fecha}
                  onChange={manejarCambio}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500"
                />
                {erroresCampos.fecha ? (
                  <p className="mt-1 text-sm text-red-600">{erroresCampos.fecha}</p>
                ) : null}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Hora inicio
                  </label>
                  <input
                    type="time"
                    name="horaInicio"
                    value={formulario.horaInicio}
                    onChange={manejarCambio}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500"
                  />
                  {erroresCampos.horaInicio ? (
                    <p className="mt-1 text-sm text-red-600">{erroresCampos.horaInicio}</p>
                  ) : null}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Hora fin estimada
                  </label>
                  <input
                    type="time"
                    value={horaFinEstimada}
                    readOnly
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-600"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Se calcula con la duración de los servicios.
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Observaciones
                </label>
                <textarea
                  name="observaciones"
                  value={formulario.observaciones}
                  onChange={manejarCambio}
                  rows="3"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex gap-2">
                {citaEnEdicion ? (
                  <button
                    type="button"
                    onClick={limpiarFormulario}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
                  >
                    Cancelar edición
                  </button>
                ) : null}
                <button
                  type="submit"
                  disabled={procesando}
                  className="w-full rounded-lg bg-sky-700 px-4 py-2 font-semibold text-white hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {procesando
                    ? "Guardando..."
                    : citaEnEdicion
                      ? "Guardar cambios"
                      : "Registrar cita"}
                </button>
              </div>
            </form>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Disponibilidad de Groomers
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Consulta quién puede recibir una Tarea en un intervalo.
            </p>

            {errorDisponibilidad ? (
              <div className="mt-4">
                <ErrorMessage mensaje={obtenerMensajeError(errorDisponibilidad)} />
              </div>
            ) : null}

            <form className="mt-4 space-y-3" onSubmit={consultarDisponibilidad}>
              <input
                type="date"
                value={consultaDisponibilidad.fecha}
                onChange={(event) =>
                  setConsultaDisponibilidad((actual) => ({
                    ...actual,
                    fecha: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
              {erroresDisponibilidad.fecha ? (
                <p className="text-sm text-red-600">{erroresDisponibilidad.fecha}</p>
              ) : null}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="time"
                  value={consultaDisponibilidad.horaInicio}
                  onChange={(event) =>
                    setConsultaDisponibilidad((actual) => ({
                      ...actual,
                      horaInicio: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
                <input
                  type="time"
                  value={consultaDisponibilidad.horaFin}
                  onChange={(event) =>
                    setConsultaDisponibilidad((actual) => ({
                      ...actual,
                      horaFin: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
              <button
                type="submit"
                disabled={consultandoDisponibilidad}
                className="w-full rounded-lg border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-800 disabled:opacity-60"
              >
                {consultandoDisponibilidad ? "Consultando..." : "Consultar disponibilidad"}
              </button>
            </form>

            <div className="mt-4 space-y-2">
              {groomersDisponibles.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No hay Groomers disponibles para el intervalo consultado.
                </p>
              ) : (
                groomersDisponibles.map((groomer) => (
                  <p key={groomer.id} className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                    {groomer.nombre}
                  </p>
                ))
              )}
            </div>
          </section>
        </div>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Citas registradas</h2>
              <p className="mt-1 text-sm text-slate-600">
                Edita o cancela únicamente citas programadas.
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="date"
                value={filtroFecha}
                onChange={(event) => setFiltroFecha(event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <select
                value={filtroEstado}
                onChange={(event) => setFiltroEstado(event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">Todos los estados</option>
                <option value="programada">programada</option>
                <option value="en_proceso">en_proceso</option>
                <option value="completada">completada</option>
                <option value="cancelada">cancelada</option>
              </select>
            </div>
          </div>

          {cargando ? (
            <div className="mt-8 text-center text-sm text-slate-600">
              Cargando citas...
            </div>
          ) : citasFiltradas.length === 0 ? (
            <div className="mt-8 rounded-lg border border-dashed border-slate-300 p-10 text-center">
              <p className="font-medium text-slate-700">No hay citas para mostrar</p>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {citasFiltradas.map((cita) => (
                <article key={cita.id} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {cita.fecha} · {cita.horaInicio} - {cita.horaFinEstimada}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {etiquetaPerro(cita.perroId)}
                      </p>
                      <p className="text-sm text-slate-600">
                        Servicios: {(cita.servicioIds || []).join(", ") || "Sin servicios"}
                      </p>
                      <p className="mt-2 text-xs font-semibold uppercase text-slate-500">
                        {cita.estado}
                      </p>
                    </div>
                    {cita.estado === "programada" ? (
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          disabled={procesando}
                          onClick={() => iniciarEdicion(cita)}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          disabled={procesando}
                          onClick={() => manejarCancelar(cita)}
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : null}
                    {citaPuedeFinalizarse(cita) ? (
                      <button
                        type="button"
                        disabled={procesando}
                        onClick={() => abrirFinalizar(cita)}
                        className="rounded-lg bg-sky-700 px-3 py-2 text-sm font-medium text-white hover:bg-sky-800 disabled:opacity-60"
                      >
                        Finalizar
                      </button>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <Modal open={Boolean(citaAFinalizar)} onClose={cerrarFinalizar}>
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Finalizar cita
          </h2>
          <p className="mt-1 mb-4 text-sm text-slate-600">
            Registra las observaciones de la atención. Todos los campos son opcionales.
          </p>
          <RegistroAtencionForm
            formulario={formularioFinalizar}
            erroresCampos={error?.erroresCampos || {}}
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
