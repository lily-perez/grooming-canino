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
  validarRegistro,
} from "@/utils/validacionesAutenticacion";

export default function RegistroForm() {
  const router = useRouter();
  const { registrar, cargando } = useAuth();
  const [formulario, setFormulario] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    confirmarContrasena: "",
  });
  const [erroresCampos, setErroresCampos] = useState({});
  const [error, setError] = useState(null);

  function actualizarCampo(event) {
    const { name, value } = event.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
  }

  async function enviar(event) {
    event.preventDefault();
    const validacion = validarRegistro(formulario);
    const errores = { ...validacion.erroresCampos };

    if (formulario.contrasena !== formulario.confirmarContrasena) {
      errores.confirmarContrasena = "Las contraseñas no coinciden.";
    }

    setErroresCampos(errores);
    setError(null);

    if (tieneErrores(errores)) {
      return;
    }

    try {
      await registrar(validacion.datos);
      router.replace("/login?registro=exitoso");
    } catch (errorPeticion) {
      setErroresCampos(errorPeticion.erroresCampos || {});
      setError(errorPeticion);
    }
  }

  return (
    <form onSubmit={enviar} className="mt-6 space-y-4" noValidate>
      <ErrorMessage mensaje={error?.mensaje} />

      <Input
        label="Nombre"
        name="nombre"
        value={formulario.nombre}
        onChange={actualizarCampo}
        error={erroresCampos.nombre}
        autoComplete="name"
      />
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
        autoComplete="new-password"
      />
      <Input
        label="Confirmar contraseña"
        name="confirmarContrasena"
        type="password"
        value={formulario.confirmarContrasena}
        onChange={actualizarCampo}
        error={erroresCampos.confirmarContrasena}
        autoComplete="new-password"
      />

      <Button type="submit" disabled={cargando}>
        {cargando ? "Creando cuenta..." : "Crear cuenta"}
      </Button>

      <p className="text-sm text-slate-600">
        ¿Ya tienes cuenta?{" "}
        <Link className="font-medium text-sky-700 hover:text-sky-900" href="/login">
          Volver a Login
        </Link>
      </p>
    </form>
  );
}
