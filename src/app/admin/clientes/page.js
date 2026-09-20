import GestionClientes from "@/components/clientes/GestionClientes";

export default function AdminClientesPage() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Clientes y Mascotas
          </h1>
          <p className="text-sm text-gray-600">
            Administra los dueños y la información de sus mascotas.
          </p>
        </div>
      </div>

      <GestionClientes />
    </section>
  );
}
