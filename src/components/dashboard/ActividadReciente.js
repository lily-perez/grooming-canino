import EmptyState from "@/components/shared/EmptyState";

export default function ActividadReciente({ items = [], busqueda, onBuscar }) {
  const termino = String(busqueda || "").trim().toLowerCase();
  const filtrados = termino
    ? items.filter((item) => {
        const texto = [item.perroNombre, item.clienteNombre, item.accion, item.estado]
          .join(" ")
          .toLowerCase();
        return texto.includes(termino);
      })
    : items;

  return (
    <div>
      <input
        type="search"
        value={busqueda}
        onChange={(event) => onBuscar(event.target.value)}
        placeholder="Buscar por cliente o perro"
        className="mb-4 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
      />

      {filtrados.length === 0 ? (
        <EmptyState
          mensaje={
            items.length === 0
              ? "Sin actividad reciente en el período."
              : "No hay resultados para la búsqueda."
          }
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-gray-200 text-gray-500">
              <tr>
                <th className="py-2 pr-3 font-medium">Fecha</th>
                <th className="py-2 pr-3 font-medium">Perro</th>
                <th className="py-2 pr-3 font-medium">Cliente</th>
                <th className="py-2 pr-3 font-medium">Estado</th>
                <th className="py-2 font-medium">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 last:border-0">
                  <td className="py-2 pr-3 text-gray-800">
                    {item.fecha}
                    {item.hora ? ` · ${item.hora}` : ""}
                  </td>
                  <td className="py-2 pr-3 text-gray-800">{item.perroNombre}</td>
                  <td className="py-2 pr-3 text-gray-800">{item.clienteNombre}</td>
                  <td className="py-2 pr-3 uppercase text-gray-600">{item.estado}</td>
                  <td className="py-2 text-gray-700">{item.accion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
