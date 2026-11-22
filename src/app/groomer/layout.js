import { redirect } from "next/navigation";
import BotonCerrarSesion from "@/components/autenticacion/BotonCerrarSesion";
import NavLink from "@/components/shared/NavLink";
import { obtenerUsuarioAutenticado } from "@/server/autenticacion/autorizacion";

const ACTIVO =
  "flex items-center rounded-xl bg-amber-600 px-4 py-3 font-semibold text-white shadow-sm";

const INACTIVO =
  "flex items-center rounded-xl px-4 py-3 font-medium text-slate-600 transition hover:bg-amber-50 hover:text-amber-700";

export default async function GroomerLayout({ children }) {
  const usuario = await obtenerUsuarioAutenticado();

  if (!usuario) {
    redirect("/login?mensaje=sesion-requerida");
  }

  if (usuario.rol !== "groomer") {
    redirect("/admin/dashboard?mensaje=acceso-denegado");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-amber-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 lg:px-8">
          <div>
            <p className="text-lg font-bold text-slate-900">
              Grooming Canino
            </p>

            <p className="text-sm text-slate-500">
              {usuario.nombre} · Groomer
            </p>
          </div>

          <BotonCerrarSesion />
        </div>
      </header>

      <div className="mx-auto flex max-w-[1500px]">
        <aside className="hidden min-h-[calc(100vh-73px)] w-64 shrink-0 border-r border-amber-100 bg-white p-5 md:block">
          <div className="mb-6 px-3">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Menú
            </p>
          </div>

          <nav className="space-y-2">
            <NavLink
              href="/groomer/dashboard"
              activeClassName={ACTIVO}
              idleClassName={INACTIVO}
            >
              Dashboard
            </NavLink>

            <NavLink
              href="/groomer/servicios"
              activeClassName={ACTIVO}
              idleClassName={INACTIVO}
            >
              Servicios y mis tareas
            </NavLink>
          </nav>

          <div className="mt-8 rounded-2xl bg-amber-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
              Sesión activa
            </p>

            <p className="mt-2 truncate text-sm font-medium text-slate-700">
              {usuario.correo}
            </p>

            <span className="mt-3 inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              Groomer autorizado
            </span>
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-5 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}