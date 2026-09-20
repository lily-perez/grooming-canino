import EmptyState from "@/components/shared/EmptyState";

export default function ClientesFrecuentes({ clientes = [] }) {
  if (clientes.length === 0) {
    return <EmptyState mensaje="Sin datos de clientes frecuentes en el período." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 text-gray-500">
          <tr>
            <th className="py-2 pr-4 font-medium">Cliente</th>
            <th className="py-2 font-medium">Citas</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={String(cliente.id)} className="border-b border-gray-100 last:border-0">
              <td className="py-2 pr-4 text-gray-800">{cliente.nombre}</td>
              <td className="py-2 font-semibold text-gray-800">{cliente.cantidad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
