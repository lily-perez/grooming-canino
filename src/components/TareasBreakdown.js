"use client";

import { IconGrip, IconPencil, IconCheck } from "./icons";

const ESTADO_LABEL = {
  pendiente: "Pendiente",
  en_proceso: "En proceso",
  completada: "Completada",
};

function Avatar({ nombre }) {
  const inicial = nombre ? nombre.trim().charAt(0).toUpperCase() : "?";
  return (
    <div className="w-6 h-6 rounded-full bg-teal-100 text-sky-700 text-xs font-medium flex items-center justify-center shrink-0">
      {inicial}
    </div>
  );
}

export default function TareasBreakdown({
  tareas,
  servicios,
  onEditar,
  onCambiarEstado,
  puedeEditar,
  puedeCambiarEstado,
}) {
  if (tareas.length === 0) {
    return (
      <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center">
        <p className="text-slate-500 text-sm">No hay tareas registradas.</p>
        <p className="text-slate-400 text-xs mt-1">Agrega una con el botón &quot;Nueva tarea&quot;.</p>
      </div>
    );
  }

  function servicioDe(servicioId) {
    return servicios.find((s) => String(s.id) === String(servicioId));
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
      {tareas.map((t, i) => {
        const servicio = servicioDe(t.servicioId);
        return (
          <div key={t.id} className="flex items-center gap-3 px-4 py-3 group">
            <IconGrip className="w-4 h-4 text-slate-300 shrink-0" />
            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-medium flex items-center justify-center shrink-0">
              {i + 1}
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-800 truncate">{t.nombre}</p>
              <p className="text-xs text-slate-400 truncate">
                {servicio ? servicio.nombre : "Sin servicio"} · {t.horaInicio || "--:--"} - {t.horaFin || "--:--"}
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 shrink-0">
              <Avatar nombre={t.groomerId} />
              {t.groomerId || "Sin asignar"}
            </div>

            <button
              onClick={() => onCambiarEstado(t)}
              disabled={!puedeCambiarEstado || t.estado === "completada"}
              className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full transition ${
                t.estado === "completada"
                  ? "bg-emerald-50 text-emerald-700"
                  : t.estado === "en_proceso"
                    ? "bg-sky-50 text-sky-700"
                    : "bg-amber-50 text-amber-700"
              } ${!puedeCambiarEstado || t.estado === "completada" ? "cursor-default" : ""}`}
            >
              <span className="inline-flex items-center gap-1">
                {t.estado === "completada" && <IconCheck className="w-3 h-3" />}
                {ESTADO_LABEL[t.estado] || t.estado}
              </span>
            </button>

            {puedeEditar && t.estado === "pendiente" && (
              <div className="hidden sm:flex gap-3 opacity-0 group-hover:opacity-100 transition shrink-0">
                <button onClick={() => onEditar(t)} aria-label="Editar tarea" className="text-slate-400 hover:text-sky-700">
                  <IconPencil className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}