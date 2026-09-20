import GestionCitas from "@/components/citas/GestionCitas";

export default async function CitasPage({ searchParams }) {
  const params = await searchParams;

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
          Gestión de citas
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Citas y disponibilidad
        </h1>

        <p className="mt-2 text-slate-600">
          Administra las citas del negocio y consulta la disponibilidad de los
          groomers.
        </p>
      </div>

      <GestionCitas perroIdInicial={params.perroId || ""} />
    </section>
  );
}