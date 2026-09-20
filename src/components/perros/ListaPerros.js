"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import EmptyState from "@/components/shared/EmptyState";
import ErrorMessage from "@/components/shared/ErrorMessage";
import Loading from "@/components/shared/Loading";
import { useClientes } from "@/hooks/useClientes";
import { usePerros } from "@/hooks/usePerros";
import { obtenerMensajeError } from "@/utils/errores";

export default function ListaPerros() {
  const { perros, cargando, error, cargarPerros } = usePerros();
  const { clientes } = useClientes();
  const [busqueda, setBusqueda] = useState("");

  const clientesPorId = useMemo(
    () => new Map(clientes.map((cliente) => [String(cliente.id), cliente])),
    [clientes],
  );

  const perrosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    if (!termino) {
      return perros;
    }

    return perros.filter((perro) => {
      const cliente = clientesPorId.get(String(perro.clienteId));
      const texto = [perro.nombre, perro.raza, perro.sexo, cliente?.nombre]
        .join(" ")
        .toLowerCase();
      return texto.includes(termino);
    });
  }, [perros, busqueda, clientesPorId]);

  if (cargando) {
    return <Loading mensaje="Cargando perros..." />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage mensaje={obtenerMensajeError(error)} />
        <button
          type="button"
          onClick={() => cargarPerros()}
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
          placeholder="Buscar por nombre, raza o cliente"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 md:max-w-sm"
        />
        <Link
          href="/admin/perros/nuevo"
          className="rounded-lg bg-sky-700 px-4 py-2 text-center font-medium text-white hover:bg-sky-800"
        >
          Registrar perro
        </Link>
      </div>

      {perrosFiltrados.length === 0 ? (
        <EmptyState
          mensaje={
            perros.length === 0
              ? "No hay perros registrados."
              : "No hay perros que coincidan con la búsqueda."
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Nombre</th>
                <th className="px-4 py-3 font-semibold">Cliente</th>
                <th className="px-4 py-3 font-semibold">Raza</th>
                <th className="px-4 py-3 font-semibold">Sexo</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {perrosFiltrados.map((perro) => {
                const cliente = clientesPorId.get(String(perro.clienteId));

                return (
                  <tr key={perro.id} className="border-t border-slate-200">
                    <td className="px-4 py-3">{perro.nombre}</td>
                    <td className="px-4 py-3">
                      {cliente ? cliente.nombre : "Cliente no encontrado"}
                    </td>
                    <td className="px-4 py-3">{perro.raza || "—"}</td>
                    <td className="px-4 py-3">{perro.sexo || "—"}</td>
                    <td className="px-4 py-3">
                      {perro.activo ? "Activo" : "Inactivo"}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/perros/${perro.id}`}
                        className="font-medium text-sky-700 hover:text-sky-900"
                      >
                        Ver perro
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
