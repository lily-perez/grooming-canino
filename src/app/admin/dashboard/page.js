import DashboardAdmin from "@/components/dashboard/DashboardAdmin";

export default async function AdminDashboardPage({ searchParams }) {
  const parametros = await searchParams;

  return (
    <section>
      {parametros.mensaje === "acceso-denegado" ? (
        <div
          role="alert"
          className="mx-6 mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800"
        >
          Acceso denegado para la ruta solicitada.
        </div>
      ) : null}
      <DashboardAdmin />
    </section>
  );
}
