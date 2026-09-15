"use client";

import { useState } from "react";
import { useCitas } from "@/hooks/useCitas";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { obtenerMensajeError } from "@/utils/errores";

const FORMULARIO_INICIAL = {
  clienteId: "",
  perroId: "",
  groomerId: "",
  servicioId: "",
  fecha: "",
  horaInicio: "",
  horaFin: "",
  estado: "programada",
  observaciones: "",
};

export default function GestionCitas() {
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);

  const {
    citas,
    cargando,
    procesando,
    error,
    crearCita,
    eliminarCita,
  } = useCitas();

  function manejarCambio(event) {
    const { name, value } = event.target;

    setFormulario((actual) => ({
      ...actual,
      [name]: value,
    }));
  }

  async function manejarSubmit(event) {
    event.preventDefault();

    try {
      await crearCita(formulario);
      setFormulario(FORMULARIO_INICIAL);
    } catch {
      // El hook ya almacena el error para mostrarlo en pantalla.
    }
  }

  async function manejarEliminar(id) {
    const confirmar = window.confirm(
      "¿Deseas eliminar esta cita?",
    );

    if (!confirmar) {
      return;
    }

    try {
      await eliminarCita(id);
    } catch {
      // El hook ya maneja el error.
    }
  }

  const erroresCampos = error?.erroresCampos || {};

  return (
    <div className="space-y-6">
      {error ? (
        <ErrorMessage mensaje={obtenerMensajeError(error)} />
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-slate-900">
              Nueva cita
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Registra la información de la cita y asigna un groomer.
            </p>
          </div>

          <form className="space-y-4" onSubmit={manejarSubmit}>
            <CampoTexto
              label="Cliente"
              name="clienteId"
              value={formulario.clienteId}
              onChange={manejarCambio}
              placeholder="Cliente"
              error={erroresCampos.clienteId}
            />

            <CampoTexto
              label="Perro"
              name="perroId"
              value={formulario.perroId}
              onChange={manejarCambio}
              placeholder="Perro"
              error={erroresCampos.perroId}
            />

            <CampoTexto
              label="Servicio"
              name="servicioId"
              value={formulario.servicioId}
              onChange={manejarCambio}
              placeholder="Servicio de grooming"
              error={erroresCampos.servicioId}
            />

            <CampoTexto
              label="Groomer"
              name="groomerId"
              value={formulario.groomerId}
              onChange={manejarCambio}
              placeholder="Groomer"
              error={erroresCampos.groomerId}
            />

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
                <p className="mt-1 text-sm text-red-600">
                  {erroresCampos.fecha}
                </p>
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
                  <p className="mt-1 text-sm text-red-600">
                    {erroresCampos.horaInicio}
                  </p>
                ) : null}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Hora fin
                </label>

                <input
                  type="time"
                  name="horaFin"
                  value={formulario.horaFin}
                  onChange={manejarCambio}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500"
                />

                {erroresCampos.horaFin ? (
                  <p className="mt-1 text-sm text-red-600">
                    {erroresCampos.horaFin}
                  </p>
                ) : null}
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
                placeholder="Indicaciones adicionales"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500"
              />
            </div>

            <button
              type="submit"
              disabled={procesando}
              className="w-full rounded-lg bg-sky-700 px-4 py-2 font-semibold text-white hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {procesando ? "Guardando..." : "Registrar cita"}
            </button>
          </form>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Citas registradas
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Consulta las citas y la disponibilidad de los groomers.
            </p>
          </div>

          {cargando ? (
            <div className="mt-8 text-center text-sm text-slate-600">
              Cargando citas...
            </div>
          ) : citas.length === 0 ? (
            <div className="mt-8 rounded-lg border border-dashed border-slate-300 p-10 text-center">
              <p className="font-medium text-slate-700">
                No hay citas registradas
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Las citas aparecerán aquí cuando se registren.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {citas.map((cita) => (
                <article
                  key={cita.id}
                  className="rounded-lg border border-slate-200 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {cita.fecha} · {cita.horaInicio} - {cita.horaFin}
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        Groomer: {cita.groomerId}
                      </p>

                      <p className="text-sm text-slate-600">
                        Cliente: {cita.clienteId} · Perro: {cita.perroId}
                      </p>

                      <p className="text-sm text-slate-600">
                        Servicio: {cita.servicioId}
                      </p>

                      <p className="mt-2 text-xs font-semibold uppercase text-slate-500">
                        {cita.estado}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={procesando}
                      onClick={() => manejarEliminar(cita.id)}
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function CampoTexto({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500"
      />

      {error ? (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}