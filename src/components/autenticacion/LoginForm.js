"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/shared/Button";
import ErrorMessage from "@/components/shared/ErrorMessage";
import Input from "@/components/shared/Input";
import { useAuth } from "@/hooks/useAuth";
import {
  tieneErrores,
  validarLogin,
} from "@/utils/validacionesAutenticacion";

export default function LoginForm({ mensaje }) {
  const router = useRouter();
  const { login, cargando } = useAuth();
  const [formulario, setFormulario] = useState({
    correo: "",
    contrasena: "",
  });
  const [erroresCampos, setErroresCampos] = useState({});
  const [error, setError] = useState(null);

  function actualizarCampo(event) {
    const { name, value } = event.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
  }

  async function enviar(event) {
    event.preventDefault();
    const validacion = validarLogin(formulario);
    setErroresCampos(validacion.erroresCampos);
    setError(null);

    if (tieneErrores(validacion.erroresCampos)) {
      return;
    }

    try {
      const usuario = await login(validacion.datos);
      router.replace(
        usuario.rol === "administrador"
          ? "/admin/dashboard"
          : "/groomer/dashboard",
      );
      router.refresh();
    } catch (errorPeticion) {
      setErroresCampos(errorPeticion.erroresCampos || {});
      setError(errorPeticion);
    }
  }

  return (
    <form onSubmit={enviar} className="mt-6 space-y-4" noValidate>
      {mensaje ? (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          {mensaje}
        </div>
      ) : null}

      <ErrorMessage mensaje={error?.mensaje} />

      <Input
        label="Correo"
        name="correo"
        type="email"
        value={formulario.correo}
        onChange={actualizarCampo}
        error={erroresCampos.correo}
        autoComplete="email"
      />
      <Input
        label="Contraseña"
        name="contrasena"
        type="password"
        value={formulario.contrasena}
        onChange={actualizarCampo}
        error={erroresCampos.contrasena}
        autoComplete="current-password"
      />

      <Button type="submit" disabled={cargando}>
        {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
      </Button>

      <p className="text-sm text-slate-600">
        ¿No tienes cuenta?{" "}
        <Link className="font-medium text-sky-700 hover:text-sky-900" href="/registro">
          Crear cuenta
        </Link>
      </p>
    </form>
  );
}
