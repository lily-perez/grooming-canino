"use client";

import { useState } from "react";

const initialState = {
  citaId: "",
  servicioId: "",
  nombre: "",
  groomerId: "",
  horaInicio: "",
  horaFin: "",
  observaciones: "",
};

export default function TareaForm({ servicios, onSubmit, tareaInicial, onCancel }) {
  const [form, setForm] = useState(() => ({
    ...initialState,
    ...tareaInicial,
  }));
  const [errores, setErrores] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validar() {
    const nuevosErrores = {};
    if (!form.citaId.trim()) nuevosErrores.citaId = "La cita es obligatoria";
    if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
    if (!form.servicioId) nuevosErrores.servicioId = "Selecciona un servicio";
    if (!form.groomerId.trim())
      nuevosErrores.groomerId = "El Groomer es obligatorio";
    if (!form.horaInicio) nuevosErrores.horaInicio = "Indica la hora de inicio";
    if (!form.horaFin) nuevosErrores.horaFin = "Indica la hora de finalización";
    if (form.horaInicio && form.horaFin && form.horaFin <= form.horaInicio) {
      nuevosErrores.horaFin = "La hora final debe ser posterior a la inicial";
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validar()) return;
    const guardada = await onSubmit(form);
    if (guardada && !tareaInicial) setForm(initialState);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-white p-6 rounded-2xl shadow-xl">
      <div>
        <h2 className="text-base font-semibold text-slate-800">
          {tareaInicial ? "Editar tarea" : "Nueva tarea"}
        </h2>
        <p className="text-sm text-slate-400 mt-0.5">
          {tareaInicial ? "Actualiza los datos y guarda los cambios." : "Asocia la tarea con una cita, un servicio y un Groomer."}
        </p>
      </div>

      {servicios.length === 0 ? (
        <>
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            Registra al menos un servicio antes de crear tareas.
          </p>
          <div className="flex justify-end">
            <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50 transition">
              Cerrar
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-600">Nombre de la tarea</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/15 transition"
              placeholder="Cepillar antes del baño"
            />
            {errores.nombre && <p className="text-rose-600 text-xs">{errores.nombre}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-600">ID de la cita</label>
            <input
              name="citaId"
              value={form.citaId}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/15 transition"
              placeholder="ID de una cita existente"
            />
            {errores.citaId && <p className="text-rose-600 text-xs">{errores.citaId}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-600">Servicio relacionado</label>
            <select
              name="servicioId"
              value={form.servicioId}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/15 transition bg-white"
            >
              <option value="">Selecciona un servicio</option>
              {servicios.map((s) => (
                <option key={s.id} value={s.id}>{s.nombre}</option>
              ))}
            </select>
            {errores.servicioId && <p className="text-rose-600 text-xs">{errores.servicioId}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-600">ID del Groomer</label>
            <input
              name="groomerId"
              value={form.groomerId}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/15 transition"
              placeholder="ID de un Usuario Groomer activo"
            />
            {errores.groomerId && <p className="text-rose-600 text-xs">{errores.groomerId}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-600">Hora de inicio</label>
              <input
                name="horaInicio"
                type="time"
                value={form.horaInicio}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/15 transition"
              />
              {errores.horaInicio && <p className="text-rose-600 text-xs">{errores.horaInicio}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-600">Hora de finalización</label>
              <input
                name="horaFin"
                type="time"
                value={form.horaFin}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/15 transition"
              />
              {errores.horaFin && <p className="text-rose-600 text-xs">{errores.horaFin}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-600">Observaciones</label>
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              rows={2}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/15 transition resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end pt-1">
            <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50 transition">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-sky-700 text-white text-sm font-medium hover:bg-sky-800 transition">
              {tareaInicial ? "Guardar cambios" : "Agregar tarea"}
            </button>
          </div>
        </>
      )}
    </form>
  );
}