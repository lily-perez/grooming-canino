import DetallePerro from "@/components/perros/DetallePerro";

export default async function AdminDetallePerroPage({ params }) {
  const { id } = await params;

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
          Perros
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Detalle del perro
        </h1>
        <p className="mt-2 text-slate-600">
          Revisa los datos del perro, su cliente y las citas relacionadas.
        </p>
      </div>
      <DetallePerro perroId={id} />
    </section>
  );
}
