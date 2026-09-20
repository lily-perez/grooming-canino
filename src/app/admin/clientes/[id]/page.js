import DetalleCliente from "@/components/clientes/DetalleCliente";

export default async function AdminDetalleClientePage({ params }) {
  const { id } = await params;

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
          Clientes
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Detalle del cliente
        </h1>
        <p className="mt-2 text-slate-600">
          Edita los datos del cliente y consulta sus perros asociados.
        </p>
      </div>
      <DetalleCliente clienteId={id} />
    </section>
  );
}
