"use client";

import { useEffect, useState } from "react";

const MOMENTOS = [
  { value: "antes", label: "Antes de la cita" },
  { value: "durante", label: "Durante la cita" },
  { value: "despues", label: "Después de la cita" },
];

const initialState = {
  nombre: "",
  momento: MOMENTOS[0].value,
  servicioId: "",
  descripcion: "",
  completada: false,
};

export default function TareaForm({ servicios, onSubmit, tareaInicial, onCancel }) {
  const [form, setForm] = useState(tareaInicial || initialState);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    setForm(tareaInicial || initialState);
    setErrores({});
  }, [tareaInicial]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validar() {
    const nuevosErrores = {};
    if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
    if (!form.servicioId) nuevosErrores.servicioId = "Selecciona un servicio";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validar()) return;
    onSubmit(form);
    if (!tareaInicial) setForm(initialState);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-white p-6 rounded-2xl shadow-xl">
      <div>
        <h2 className="text-base font-semibold text-slate-800">
          {tareaInicial ? "Editar tarea" : "Nueva tarea"}
        </h2>
        <p className="text-sm text-slate-400 mt-0.5">
          {tareaInicial ? "Actualiza los datos y guarda los cambios." : "Asócialo a un servicio y define cuándo se realiza."}
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
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 transition"
              placeholder="Cepillar antes del baño"
            />
            {errores.nombre && <p className="text-rose-600 text-xs">{errores.nombre}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-600">Momento</label>
            <select
              name="momento"
              value={form.momento}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 transition bg-white"
            >
              {MOMENTOS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-600">Servicio relacionado</label>
            <select
              name="servicioId"
              value={form.servicioId}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 transition bg-white"
            >
              <option value="">Selecciona un servicio</option>
              {servicios.map((s) => (
                <option key={s.id} value={s.id}>{s.nombre}</option>
              ))}
            </select>
            {errores.servicioId && <p className="text-rose-600 text-xs">{errores.servicioId}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-600">Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={2}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 transition resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end pt-1">
            <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50 transition">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-teal-700 text-white text-sm font-medium hover:bg-teal-800 transition">
              {tareaInicial ? "Guardar cambios" : "Agregar tarea"}
            </button>
          </div>
        </>
      )}
    </form>
  );
}