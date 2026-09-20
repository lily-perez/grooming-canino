"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ClienteForm, {
  FORMULARIO_CLIENTE_INICIAL,
} from "@/components/clientes/ClienteForm";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { clientesRepository } from "@/repositories/clientesRepository";
import {
  tieneErroresCliente,
  validarCliente,
} from "@/utils/validacionesClientes";
import { obtenerMensajeError } from "@/utils/errores";

export default function NuevoCliente() {
  const router = useRouter();
  const [formulario, setFormulario] = useState(FORMULARIO_CLIENTE_INICIAL);
  const [erroresCampos, setErroresCampos] = useState({});
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  async function guardar(event) {
    event.preventDefault();
    const validacion = validarCliente(formulario);
    setErroresCampos(validacion.erroresCampos);
    setError(null);

    if (tieneErroresCliente(validacion.erroresCampos)) {
      return;
    }

    setGuardando(true);

    try {
      const creado = await clientesRepository.crear(validacion.datos);

      if (!creado?.id) {
        throw Object.assign(new Error("La API no devolvió el cliente creado."), {
          codigo: "ERROR_RESPUESTA",
        });
      }

      router.push(`/admin/clientes/${creado.id}`);
    } catch (errorPeticion) {
      setErroresCampos(errorPeticion.erroresCampos || {});
      setError(errorPeticion);
      setGuardando(false);
    }
  }

  return (
    <div className="max-w-xl rounded-xl border border-slate-200 bg-white p-6">
      <ErrorMessage mensaje={error ? obtenerMensajeError(error) : ""} />
      <ClienteForm
        formulario={formulario}
        erroresCampos={erroresCampos}
        guardando={guardando}
        textoAccion="Guardar"
        onChange={setFormulario}
        onSubmit={guardar}
        onCancelar={() => router.push("/admin/clientes")}
      />
    </div>
  );
}
