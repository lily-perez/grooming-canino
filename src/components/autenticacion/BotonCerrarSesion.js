"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function BotonCerrarSesion() {
  const router = useRouter();
  const { cerrarSesion, cargando } = useAuth();

  async function salir() {
    await cerrarSesion();
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={salir}
      disabled={cargando}
      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
    >
      {cargando ? "Cerrando..." : "Cerrar sesión"}
    </button>
  );
}
