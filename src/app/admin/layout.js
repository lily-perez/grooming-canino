import Link from "next/link";

const modulosPendientes = [
  "Citas",
  "Clientes",
  "Perros",
  "Servicios",
  "Groomers",
  "Historial",
  "Reportes",
  "Usuarios",
];

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-4 md:px-6">
        <div>
          <p className="font-semibold text-slate-900">Grooming Canino</p>
          <p className="text-sm text-slate-500">Área de Administrador</p>
        </div>
        <button
          type="button"
          disabled
          className="cursor-not-allowed rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-400"
        >
          Cerrar sesión — disponible en INC-01
        </button>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col md:min-h-[calc(100vh-81px)] md:flex-row">
        <aside className="border-b border-slate-200 bg-white p-4 md:w-64 md:border-r md:border-b-0">
          <nav aria-label="Navegación de Administrador" className="space-y-2">
            <Link
              href="/admin/dashboard"
              className="block rounded-lg bg-sky-700 px-3 py-2 font-medium text-white"
            >
              Dashboard
            </Link>
            {modulosPendientes.map((modulo) => (
              <button
                key={modulo}
                type="button"
                disabled
                className="block w-full cursor-not-allowed rounded-lg px-3 py-2 text-left text-slate-400"
              >
                {modulo}
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
