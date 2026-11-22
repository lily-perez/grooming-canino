"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";

import Button from "@/components/shared/Button";
import ErrorMessage from "@/components/shared/ErrorMessage";
import Input from "@/components/shared/Input";
import { auth, googleProvider } from "@/config/firebase";
import { useAuth } from "@/hooks/useAuth";
import {
  tieneErrores,
  validarLogin,
} from "@/utils/validacionesAutenticacion";

export default function LoginForm({ mensaje }) {
  const router = useRouter();
  const { login, loginGoogle, cargando } = useAuth();

  const [formulario, setFormulario] = useState({
    correo: "",
    contrasena: "",
  });

  const [erroresCampos, setErroresCampos] = useState({});
  const [error, setError] = useState(null);

  function actualizarCampo(event) {
    const { name, value } = event.target;

    setFormulario((actual) => ({
      ...actual,
      [name]: value,
    }));
  }

  function redirigir(usuario) {
    router.replace(
      usuario.rol === "administrador"
        ? "/admin/dashboard"
        : "/groomer/dashboard",
    );

    router.refresh();
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
      redirigir(usuario);
    } catch (errorPeticion) {
      setErroresCampos(
        errorPeticion.erroresCampos || {},
      );
      setError(errorPeticion);
    }
  }

  async function entrarConGoogle() {
    setError(null);
    setErroresCampos({});

    try {
      const resultado = await signInWithPopup(
        auth,
        googleProvider,
      );

      const idToken =
        await resultado.user.getIdToken();

      const usuario = await loginGoogle(idToken);

      redirigir(usuario);
    } catch (errorGoogle) {
      if (
        errorGoogle?.code === "auth/popup-closed-by-user"
      ) {
        return;
      }

      setError({
        mensaje:
          errorGoogle?.mensaje ||
          "No fue posible iniciar sesión con Google.",
      });
    }
  }

  return (
    <form
      onSubmit={enviar}
      className="mt-6 space-y-4"
      noValidate
    >
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
        {cargando
          ? "Iniciando sesión..."
          : "Iniciar sesión"}
      </Button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs text-slate-400">
          o
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <button
        type="button"
        onClick={entrarConGoogle}
        disabled={cargando}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Continuar con Google
      </button>

      <p className="text-sm text-slate-600">
        ¿No tienes cuenta?{" "}
        <Link
          className="font-medium text-sky-700 hover:text-sky-900"
          href="/registro"
        >
          Crear cuenta
        </Link>
      </p>
    </form>
  );
}