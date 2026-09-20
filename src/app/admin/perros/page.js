import ListaPerros from "@/components/perros/ListaPerros";

export default function AdminPerrosPage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
          Perros
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Gestión de perros
        </h1>
        <p className="mt-2 text-slate-600">
          Consulta y administra las mascotas asociadas a cada cliente.
        </p>
      </div>
      <ListaPerros />
    </section>
  );
}
