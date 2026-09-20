import DetalleHistorial from "@/components/historial/DetalleHistorial";

export default async function AdminDetalleHistorialPage({ params }) {
  const { id } = await params;

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
          Historial
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Detalle del registro
        </h1>
        <p className="mt-2 text-slate-600">
          Revisa la atención registrada y edita las observaciones si es necesario.
        </p>
      </div>
      <DetalleHistorial registroId={id} />
    </section>
  );
}
