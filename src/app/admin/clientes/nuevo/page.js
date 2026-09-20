import NuevoCliente from "@/components/clientes/NuevoCliente";

export default function AdminNuevoClientePage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
          Clientes
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Crear cliente</h1>
        <p className="mt-2 text-slate-600">
          Registra un cliente para poder asociarle perros.
        </p>
      </div>
      <NuevoCliente />
    </section>
  );
}
