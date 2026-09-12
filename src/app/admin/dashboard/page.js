import EmptyState from "@/components/shared/EmptyState";
import ErrorMessage from "@/components/shared/ErrorMessage";
import Loading from "@/components/shared/Loading";

export default function AdminDashboardPage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
          Estructura base
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Dashboard de Administrador
        </h1>
        <p className="mt-2 text-slate-600">
          Los indicadores y datos operativos se implementarán en incrementos
          posteriores.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Loading mensaje="Ejemplo de estado de carga." />
        <ErrorMessage mensaje="Ejemplo de mensaje de error reutilizable." />
        <EmptyState mensaje="Ejemplo de estado sin resultados." />
      </div>
    </section>
  );
}
