import EmptyState from "@/components/shared/EmptyState";

export default function GraficoCitasPorDia({ series = [] }) {
  const total = series.reduce((acumulado, item) => acumulado + item.cantidad, 0);

  if (series.length === 0 || total === 0) {
    return <EmptyState mensaje="Sin citas para graficar en el período." />;
  }

  const maximo = Math.max(...series.map((item) => item.cantidad), 1);

  return (
    <div className="flex h-44 items-end gap-1 overflow-x-auto sm:gap-2">
      {series.map((item) => {
        const altura = Math.max(
          Math.round((item.cantidad / maximo) * 100),
          item.cantidad > 0 ? 8 : 2,
        );
        return (
          <div
            key={item.fecha}
            className="flex h-full min-w-6 flex-1 flex-col items-center"
            title={`${item.fecha}: ${item.cantidad}`}
          >
            <span className="mb-1 text-[10px] text-gray-500">{item.cantidad}</span>
            <div className="flex w-full flex-1 items-end">
              <div
                className="w-full max-w-8 rounded-t bg-sky-600"
                style={{ height: `${altura}%` }}
              />
            </div>
            <span className="mt-1 text-[10px] text-gray-400">
              {item.fecha.slice(8)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
