"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import EmptyState from "@/components/shared/EmptyState";
import ErrorMessage from "@/components/shared/ErrorMessage";
import Loading from "@/components/shared/Loading";
import { useClientes } from "@/hooks/useClientes";
import { obtenerMensajeError } from "@/utils/errores";

export default function ListaClientes() {
  const { clientes, cargando, error, cargarClientes } = useClientes();
  const [busqueda, setBusqueda] = useState("");

  const clientesFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    if (!termino) {
      return clientes;
    }

    return clientes.filter((cliente) => {
      const texto = [cliente.nombre, cliente.telefono, cliente.correo]
        .join(" ")
        .toLowerCase();
      return texto.includes(termino);
    });
  }, [clientes, busqueda]);

  if (cargando) {
    return <Loading mensaje="Cargando clientes..." />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage mensaje={obtenerMensajeError(error)} />
        <button
          type="button"
          onClick={() => cargarClientes()}
          className="rounded-lg bg-sky-700 px-4 py-2 font-medium text-white"
        >
          Intentar nuevamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input
          type="search"
          value={busqueda}
          onChange={(event) => setBusqueda(event.target.value)}
          placeholder="Buscar por nombre, teléfono o correo"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 md:max-w-sm"
        />
        <Link
          href="/admin/clientes/nuevo"
          className="rounded-lg bg-sky-700 px-4 py-2 text-center font-medium text-white hover:bg-sky-800"
        >
          Crear cliente
        </Link>
      </div>

      {clientesFiltrados.length === 0 ? (
        <EmptyState
          mensaje={
            clientes.length === 0
              ? "No hay clientes registrados."
              : "No hay clientes que coincidan con la búsqueda."
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Nombre</th>
                <th className="px-4 py-3 font-semibold">Teléfono</th>
                <th className="px-4 py-3 font-semibold">Correo</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.map((cliente) => (
                <tr key={cliente.id} className="border-t border-slate-200">
                  <td className="px-4 py-3">{cliente.nombre}</td>
                  <td className="px-4 py-3">{cliente.telefono}</td>
                  <td className="px-4 py-3">{cliente.correo || "—"}</td>
                  <td className="px-4 py-3">
                    {cliente.activo ? "Activo" : "Inactivo"}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/clientes/${cliente.id}`}
                      className="font-medium text-sky-700 hover:text-sky-900"
                    >
                      Ver cliente
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
