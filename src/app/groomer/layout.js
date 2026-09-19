import { redirect } from "next/navigation";
import BotonCerrarSesion from "@/components/autenticacion/BotonCerrarSesion";
import NavLink from "@/components/shared/NavLink";
import { obtenerUsuarioAutenticado } from "@/server/autenticacion/autorizacion";

const ACTIVO = "block rounded-lg bg-amber-600 px-3 py-2 font-medium text-white";
const INACTIVO = "block rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-amber-100";

export default async function GroomerLayout({ children }) {
  const usuario = await obtenerUsuarioAutenticado();

  if (!usuario) {
    redirect("/login?mensaje=sesion-requerida");
  }

  if (usuario.rol !== "groomer") {
    redirect("/admin/dashboard?mensaje=acceso-denegado");
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200 bg-white px-4 py-4 md:px-6">
        <div>
          <p className="font-semibold text-slate-900">Grooming Canino</p>
          <p className="text-sm text-slate-500">
            {usuario.nombre} · Groomer
          </p>
        </div>
        <BotonCerrarSesion />
      </header>

      <div className="mx-auto flex max-w-6xl flex-col md:min-h-[calc(100vh-81px)] md:flex-row">
        <aside className="border-b border-amber-200 bg-white p-4 md:w-56 md:border-r md:border-b-0">
          <nav aria-label="Navegación de Groomer" className="space-y-2">
            <NavLink href="/groomer/dashboard" activeClassName={ACTIVO} idleClassName={INACTIVO}>
              Dashboard
            </NavLink>
            <NavLink href="/groomer/servicios" activeClassName={ACTIVO} idleClassName={INACTIVO}>
              Servicios y mis tareas
            </NavLink>
          </nav>
        </aside>

        <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}