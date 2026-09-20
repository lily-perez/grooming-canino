import EmptyState from "@/components/shared/EmptyState";

export default function ServiciosSolicitados({ servicios = [] }) {
  if (servicios.length === 0) {
    return <EmptyState mensaje="Sin datos de servicios solicitados en el período." />;
  }

  const maximo = Math.max(...servicios.map((item) => item.cantidad), 1);

  return (
    <ul className="space-y-3">
      {servicios.map((servicio) => (
        <li key={String(servicio.id)}>
          <div className="mb-1 flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-gray-800">{servicio.nombre}</span>
            <span className="text-gray-500">{servicio.cantidad}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-sky-600"
              style={{ width: `${Math.round((servicio.cantidad / maximo) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
