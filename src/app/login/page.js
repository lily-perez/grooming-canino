import { redirect } from "next/navigation";
import LoginForm from "@/components/autenticacion/LoginForm";
import { obtenerUsuarioAutenticado } from "@/server/autenticacion/autorizacion";

export default async function LoginPage({ searchParams }) {
  const usuario = await obtenerUsuarioAutenticado();

  if (usuario) {
    redirect(
      usuario.rol === "administrador"
        ? "/admin/dashboard"
        : "/groomer/dashboard",
    );
  }

  const parametros = await searchParams;
  const mensaje =
    parametros.registro === "exitoso"
      ? "Cuenta creada correctamente. Ya puedes iniciar sesión."
      : parametros.mensaje === "sesion-requerida"
        ? "Debes iniciar sesión para continuar."
        : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
          Grooming Canino
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Login</h1>
        <LoginForm mensaje={mensaje} />
      </section>
    </main>
  );
}
