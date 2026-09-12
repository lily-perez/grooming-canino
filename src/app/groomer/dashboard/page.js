import EmptyState from "@/components/shared/EmptyState";

export default function GroomerDashboardPage() {
  return (
    <section className="space-y-6">
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
