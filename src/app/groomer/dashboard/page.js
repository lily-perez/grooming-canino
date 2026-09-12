import EmptyState from "@/components/shared/EmptyState";

export default async function GroomerDashboardPage({ searchParams }) {
  const parametros = await searchParams;

  return (
    <section className="space-y-6">
      {parametros.mensaje === "acceso-denegado" ? (
        <div
          role="alert"
          className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800"
        >
          Acceso denegado para la ruta solicitada.
        </div>
      ) : null}

      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
          Estructura base
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Dashboard de Groomer
        </h1>
        <p className="mt-2 text-slate-600">
          Las tareas y los datos del Groomer se implementarán en incrementos
          posteriores.
        </p>
      </div>

      <EmptyState mensaje="Todavía no hay información operativa disponible." />
    </section>
  );
}
