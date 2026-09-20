import EmptyState from "@/components/shared/EmptyState";

export default function GraficoTendencia({ series = [] }) {
  const total = series.reduce((acumulado, item) => acumulado + item.total, 0);

  if (series.length === 0 || total === 0) {
    return (
      <EmptyState mensaje="Sin citas para graficar en el período." />
    );
  }

  const maximo = Math.max(...series.map((item) => item.total), 1);

  return (
    <div className="flex h-64 items-end gap-1 overflow-x-auto sm:gap-2">
      {series.map((item) => {
        const altura = Math.max(
          Math.round((item.total / maximo) * 100),
          item.total > 0 ? 8 : 2,
        );

        return (
          <div
            key={item.fecha}
            className="flex h-full min-w-6 flex-1 flex-col items-center"
            title={`${item.dia} ${item.fecha}: ${item.total}`}
          >
            <span className="mb-1 text-[10px] text-slate-500">{item.total}</span>
            <div className="flex w-full flex-1 items-end">
              <div
                className="w-full max-w-8 rounded-t bg-sky-600"
                style={{ height: `${altura}%` }}
              />
            </div>
            <span className="mt-1 text-[10px] text-slate-400">
              {item.fecha.slice(8)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
