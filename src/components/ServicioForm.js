"use client";

import { useEffect, useState } from "react";

const CATEGORIAS = ["Baño", "Corte", "Uñas", "Oídos", "Otro"];

const initialState = {
  nombre: "",
  categoria: CATEGORIAS[0],
  duracion: "",
  precio: "",
  groomerAsignado: "",
  descripcion: "",
};

export default function ServicioForm({ onSubmit, servicioInicial, onCancel }) {
  const [form, setForm] = useState(servicioInicial || initialState);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    setForm(servicioInicial || initialState);
    setErrores({});
  }, [servicioInicial]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validar() {
    const nuevosErrores = {};
    if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
    if (!form.duracion || Number(form.duracion) <= 0)
      nuevosErrores.duracion = "Debe ser un número mayor a 0";
    if (!form.precio || Number(form.precio) <= 0)
      nuevosErrores.precio = "Debe ser un número mayor a 0";
    if (!form.groomerAsignado.trim())
      nuevosErrores.groomerAsignado = "Asigna un groomer";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validar()) return;
    onSubmit({
      ...form,
      duracion: Number(form.duracion),
      precio: Number(form.precio),
    });
    if (!servicioInicial) setForm(initialState);
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

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-600">Nombre</label>
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 transition"
          placeholder="Baño completo"
        />
        {errores.nombre && <p className="text-rose-600 text-xs">{errores.nombre}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-600">Categoría</label>
        <select
          name="categoria"
          value={form.categoria}
          onChange={handleChange}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 transition bg-white"
        >
          {CATEGORIAS.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-600">Duración (min)</label>
          <input
            name="duracion"
            type="number"
            value={form.duracion}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 transition"
          />
          {errores.duracion && <p className="text-rose-600 text-xs">{errores.duracion}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-600">Precio ($)</label>
          <input
            name="precio"
            type="number"
            value={form.precio}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 transition"
          />
          {errores.precio && <p className="text-rose-600 text-xs">{errores.precio}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-600">Groomer asignado</label>
        <input
          name="groomerAsignado"
          value={form.groomerAsignado}
          onChange={handleChange}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 transition"
          placeholder="Larris"
        />
        {errores.groomerAsignado && <p className="text-rose-600 text-xs">{errores.groomerAsignado}</p>}
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
          {servicioInicial ? "Guardar cambios" : "Agregar servicio"}
        </button>
      </div>
    </form>
  );
}