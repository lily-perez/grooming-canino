import ListaClientes from "@/components/clientes/ListaClientes";

export default function AdminClientesPage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
          Clientes
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Gestión de clientes
        </h1>
        <p className="mt-2 text-slate-600">
          Consulta, crea y administra los clientes del negocio.
        </p>
      </div>
      <ListaClientes />
    </section>
  );
}
