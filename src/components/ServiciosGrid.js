"use client";

import { IconScissors, IconPencil, IconTrash } from "./icons";

export default function ServiciosGrid({ servicios, onEditar, onEliminar, soloLectura }) {
  if (servicios.length === 0) {
    return (
      <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center">
        <p className="text-slate-500 text-sm">No encontramos servicios.</p>
        <p className="text-slate-400 text-xs mt-1">Agrega uno con el botón "Nuevo servicio".</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {servicios.map((s) => (
        <div
          key={s.id}
          className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <IconScissors className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 rounded-full px-2.5 py-1">
              {s.duracion} min
            </span>
          </div>

          <h3 className="mt-4 font-semibold text-slate-800">{s.nombre}</h3>
          <p className="text-sm text-slate-400 mt-1 line-clamp-2 min-h-[2.5rem]">
            {s.descripcion || "Sin descripción."}
          </p>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="font-semibold text-sky-700">${s.precio}</span>
            <span className="text-slate-500">{s.groomerAsignado}</span>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs px-2 py-0.5 rounded-full bg-sky-50 text-sky-700">
              {s.categoria}
            </span>
            {!soloLectura && (
              <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => onEditar(s)}
                  aria-label="Editar servicio"
                  className="text-slate-400 hover:text-sky-700"
                >
                  <IconPencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEliminar(s.id)}
                  aria-label="Eliminar servicio"
                  className="text-slate-400 hover:text-rose-600"
                >
                  <IconTrash className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}