import { redirect } from "next/navigation";
import BotonCerrarSesion from "@/components/autenticacion/BotonCerrarSesion";
import NavLink from "@/components/shared/NavLink";
import { obtenerUsuarioAutenticado } from "@/server/autenticacion/autorizacion";

const ACTIVO = "block rounded-lg bg-sky-700 px-3 py-2 font-medium text-white";
const INACTIVO = "block rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-slate-100";

export default async function AdminLayout({ children }) {
  const usuario = await obtenerUsuarioAutenticado();

  if (!usuario) {
    redirect("/login?mensaje=sesion-requerida");
  }

  if (usuario.rol !== "administrador") {
    redirect("/groomer/dashboard?mensaje=acceso-denegado");
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-4 md:px-6">
        <div>
          <p className="font-semibold text-slate-900">Grooming Canino</p>
          <p className="text-sm text-slate-500">
            {usuario.nombre} · Administrador
          </p>
        </div>
        <BotonCerrarSesion />
      </header>

      <div className="mx-auto flex max-w-7xl flex-col md:min-h-[calc(100vh-81px)] md:flex-row">
        <aside className="border-b border-slate-200 bg-white p-4 md:w-64 md:border-r md:border-b-0">
          <nav aria-label="Navegación de Administrador" className="space-y-2">
            <NavLink href="/admin/dashboard" activeClassName={ACTIVO} idleClassName={INACTIVO}>
              Dashboard
            </NavLink>
            <NavLink href="/admin/citas" activeClassName={ACTIVO} idleClassName={INACTIVO}>
              Citas
            </NavLink>
            <NavLink href="/admin/clientes" activeClassName={ACTIVO} idleClassName={INACTIVO}>
              Clientes
            </NavLink>
            <NavLink href="/admin/perros" activeClassName={ACTIVO} idleClassName={INACTIVO}>
              Perros
            </NavLink>
            <NavLink href="/admin/servicios" activeClassName={ACTIVO} idleClassName={INACTIVO}>
              Servicios
            </NavLink>
            <NavLink href="/admin/groomers" activeClassName={ACTIVO} idleClassName={INACTIVO}>
              Groomers
            </NavLink>
            <NavLink href="/admin/usuarios" activeClassName={ACTIVO} idleClassName={INACTIVO}>
              Usuarios
            </NavLink>
            <NavLink href="/admin/historial" activeClassName={ACTIVO} idleClassName={INACTIVO}>
              Historial
            </NavLink>
            <NavLink href="/admin/reportes" activeClassName={ACTIVO} idleClassName={INACTIVO}>
              Reportes
            </NavLink>
          </nav>
        </aside>

        <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}