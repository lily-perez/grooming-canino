"use client";

import Link from "next/link";
import EmptyState from "@/components/shared/EmptyState";

export default function TablaClientes({
  clientes = [],
  clienteSeleccionadoId,
  onSelectCliente,
  onEditCliente,
  onCambiarEstado,
}) {
  if (clientes.length === 0) {
    return <EmptyState mensaje="No hay clientes registrados." />;
  }

  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow-md">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="px-4 py-3 font-semibold">Nombre</th>
            <th className="px-4 py-3 font-semibold">Teléfono</th>
            <th className="px-4 py-3 font-semibold">Correo</th>
            <th className="px-4 py-3 font-semibold">Estado</th>
            <th className="px-4 py-3 font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => {
            const seleccionado =
              String(clienteSeleccionadoId) === String(cliente.id);

            return (
              <tr
                key={cliente.id}
                className={`border-t border-gray-200 ${
                  seleccionado ? "bg-blue-50" : "bg-white"
                }`}
              >
                <td className="px-4 py-3 font-medium text-gray-900">
                  {cliente.nombre}
                </td>
                <td className="px-4 py-3 text-gray-700">{cliente.telefono}</td>
                <td className="px-4 py-3 text-gray-700">
                  {cliente.correo || "—"}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {cliente.activo ? "Activo" : "Inactivo"}
                </td>
                <td className="space-x-3 px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onSelectCliente(cliente)}
                    className="font-medium text-blue-700 hover:text-blue-900"
                  >
                    Ver mascotas
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditCliente(cliente)}
                    className="font-medium text-gray-700 hover:text-gray-900"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onCambiarEstado(cliente)}
                    className="font-medium text-red-700 hover:text-red-900"
                  >
                    {cliente.activo ? "Desactivar" : "Activar"}
                  </button>
                  <Link
                    href={`/admin/clientes/${cliente.id}`}
                    className="font-medium text-sky-700 hover:text-sky-900"
                  >
                    Detalle
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
