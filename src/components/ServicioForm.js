"use client";

import { useState } from "react";

const initialState = {
  nombre: "",
  duracionEstimadaMinutos: "",
  descripcion: "",
};

export default function ServicioForm({
  onSubmit,
  servicioInicial,
  onCancel,
  enviando = false,
  errorServidor = null,
}) {
  const [form, setForm] = useState(() => ({
    ...initialState,
    ...servicioInicial,
  }));
  const [errores, setErrores] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validar() {
    const nuevosErrores = {};
    if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
    if (
      !form.duracionEstimadaMinutos ||
      Number(form.duracionEstimadaMinutos) <= 0
    ) {
      nuevosErrores.duracionEstimadaMinutos =
        "Debe ser un número mayor a 0";
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (enviando || !validar()) return;
    const guardado = await onSubmit({
      ...form,
      duracionEstimadaMinutos: Number(form.duracionEstimadaMinutos),
    });
    if (guardado && !servicioInicial) setForm(initialState);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-white p-6 rounded-2xl shadow-xl">
      <div>
        <h2 className="text-base font-semibold text-slate-800">
          {servicioInicial ? "Editar servicio" : "Nuevo servicio"}
        </h2>
        <p className="text-sm text-slate-400 mt-0.5">
          {servicioInicial ? "Actualiza los datos y guarda los cambios." : "Complétalo para agregarlo al catálogo."}
        </p>
      </div>

      {errorServidor && (
        <p
          role="alert"
          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
        >
          {errorServidor}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-600">Nombre</label>
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          disabled={enviando}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/15 transition"
          placeholder="Baño completo"
        />
        {errores.nombre && <p className="text-rose-600 text-xs">{errores.nombre}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-600">Duración estimada (min)</label>
        <input
          name="duracionEstimadaMinutos"
          type="number"
          min="1"
          value={form.duracionEstimadaMinutos}
          onChange={handleChange}
          disabled={enviando}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/15 transition"
        />
        {errores.duracionEstimadaMinutos && (
          <p className="text-rose-600 text-xs">
            {errores.duracionEstimadaMinutos}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-600">Descripción</label>
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          disabled={enviando}
          rows={2}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/15 transition resize-none"
        />
      </div>

      <div className="flex gap-3 justify-end pt-1">
        <button type="button" onClick={onCancel} disabled={enviando} className="px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50 transition disabled:cursor-not-allowed disabled:opacity-60">
          Cancelar
        </button>
        <button type="submit" disabled={enviando} className="px-4 py-2 rounded-lg bg-sky-700 text-white text-sm font-medium hover:bg-sky-800 transition disabled:cursor-not-allowed disabled:opacity-60">
          {enviando
            ? "Guardando..."
            : servicioInicial
              ? "Guardar cambios"
              : "Agregar servicio"}
        </button>
      </div>
    </form>
  );
}