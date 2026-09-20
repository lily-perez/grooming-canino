import ListaHistorial from "@/components/historial/ListaHistorial";

export default function AdminHistorialPage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
          Historial
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Historial de atenciones
        </h1>
        <p className="mt-2 text-slate-600">
          Consulta los registros de atención por perro y por fecha.
        </p>
      </div>
      <ListaHistorial />
    </section>
  );
}
