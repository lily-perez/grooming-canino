import NuevoPerro from "@/components/perros/NuevoPerro";

export default async function AdminNuevoPerroPage({ searchParams }) {
  const params = await searchParams;

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
          Perros
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Registrar perro
        </h1>
        <p className="mt-2 text-slate-600">
          El perro debe pertenecer a un cliente existente y activo.
        </p>
      </div>
      <NuevoPerro clienteIdInicial={params.clienteId || ""} />
    </section>
  );
}
