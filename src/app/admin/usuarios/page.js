import GestionUsuarios from "@/components/usuarios/GestionUsuarios";

export default function UsuariosPage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
          Administración
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Usuarios</h1>
        <p className="mt-2 text-slate-600">
          Gestiona los datos, roles y estado de las cuentas existentes.
        </p>
      </div>

      <GestionUsuarios />
    </section>
  );
}
