"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import EmptyState from "@/components/shared/EmptyState";
import ErrorMessage from "@/components/shared/ErrorMessage";
import Loading from "@/components/shared/Loading";
import { useHistorial } from "@/hooks/useHistorial";
import { usePerros } from "@/hooks/usePerros";
import { obtenerMensajeError } from "@/utils/errores";

function resumenObservaciones(registro) {
  const texto = String(registro.observaciones || "").trim();

  if (texto) {
    return texto.length > 80 ? `${texto.slice(0, 77)}...` : texto;
  }

  return "Sin observaciones";
}

export default function ListaHistorial() {
  const { perros } = usePerros();
  const [perroId, setPerroId] = useState("");
  const [fecha, setFecha] = useState("");
  const { registros, cargando, error, cargarHistorial } = useHistorial();

  const perrosOrdenados = useMemo(
    () => [...perros].sort((a, b) => a.nombre.localeCompare(b.nombre)),
    [perros],
  );

  function aplicarFiltros(event) {
    event.preventDefault();
    cargarHistorial({
      ...(perroId ? { perroId } : {}),
      ...(fecha ? { fecha } : {}),
    }).catch(() => {
      // El hook conserva el error.
    });
  }

  function limpiarFiltros() {
    setPerroId("");
    setFecha("");
    cargarHistorial({}).catch(() => {
      // El hook conserva el error.
    });
  }

  return (
    <div className="space-y-4">
      {error ? <ErrorMessage mensaje={obtenerMensajeError(error)} /> : null}

      <form
        className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 md:flex-row md:items-end"
        onSubmit={aplicarFiltros}
      >
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Perro
          </label>
          <select
            value={perroId}
            onChange={(event) => setPerroId(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Todos los perros</option>
            {perrosOrdenados.map((perro) => (
              <option key={perro.id} value={perro.id}>
                {perro.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Fecha
          </label>
          <input
            type="date"
            value={fecha}
            onChange={(event) => setFecha(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-medium text-white hover:bg-sky-800"
        >
          Filtrar
        </button>
        <button
          type="button"
          onClick={limpiarFiltros}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
        >
          Limpiar
        </button>
      </form>

      {cargando ? (
        <Loading mensaje="Cargando historial..." />
      ) : registros.length === 0 ? (
        <EmptyState mensaje="No hay registros de atención para mostrar." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Perro</th>
                <th className="px-4 py-3 font-medium">Cita</th>
                <th className="px-4 py-3 font-medium">Registrado por</th>
                <th className="px-4 py-3 font-medium">Observaciones</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((registro) => (
                <tr key={registro.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 text-slate-800">{registro.fecha || "—"}</td>
                  <td className="px-4 py-3 text-slate-800">
                    {registro.perro?.nombre || "Perro no disponible"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {registro.cita
                      ? `${registro.cita.fecha} · ${registro.cita.horaInicio}`
                      : registro.citaId}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {registro.registradoPor?.nombre || "Usuario no disponible"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {resumenObservaciones(registro)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/historial/${registro.id}`}
                      className="font-medium text-sky-700 hover:text-sky-900"
                    >
                      Ver registro
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
