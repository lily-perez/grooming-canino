"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PerroForm, { FORMULARIO_PERRO_INICIAL } from "@/components/perros/PerroForm";
import ErrorMessage from "@/components/shared/ErrorMessage";
import Loading from "@/components/shared/Loading";
import { useClientes } from "@/hooks/useClientes";
import { perrosRepository } from "@/repositories/perrosRepository";
import { tieneErroresPerro, validarPerro } from "@/utils/validacionesPerros";
import { obtenerMensajeError } from "@/utils/errores";

export default function NuevoPerro({ clienteIdInicial = "" }) {
  const router = useRouter();
  const { clientes, cargando, error: errorClientes } = useClientes();
  const [formulario, setFormulario] = useState({
    ...FORMULARIO_PERRO_INICIAL,
    clienteId: clienteIdInicial,
  });
  const [erroresCampos, setErroresCampos] = useState({});
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const clientesDisponibles = useMemo(() => {
    const seleccionActual = clientes.find(
      (cliente) => String(cliente.id) === String(formulario.clienteId),
    );

    return clientes.filter(
      (cliente) =>
        cliente.activo || String(cliente.id) === String(seleccionActual?.id),
    );
  }, [clientes, formulario.clienteId]);

  async function guardar(event) {
    event.preventDefault();
    const validacion = validarPerro(formulario);
    setErroresCampos(validacion.erroresCampos);
    setError(null);

    if (tieneErroresPerro(validacion.erroresCampos)) {
      return;
    }

    setGuardando(true);

    try {
      const creado = await perrosRepository.crear(validacion.datos);

      if (!creado?.id) {
        throw Object.assign(new Error("La API no devolvió el perro creado."), {
          codigo: "ERROR_RESPUESTA",
        });
      }

      router.push(`/admin/perros/${creado.id}`);
    } catch (errorPeticion) {
      setErroresCampos(errorPeticion.erroresCampos || {});
      setError(errorPeticion);
      setGuardando(false);
    }
  }

  if (cargando) {
    return <Loading mensaje="Cargando clientes..." />;
  }

  if (errorClientes) {
    return <ErrorMessage mensaje={obtenerMensajeError(errorClientes)} />;
  }

  return (
    <div className="max-w-xl rounded-xl border border-slate-200 bg-white p-6">
      <ErrorMessage mensaje={error ? obtenerMensajeError(error) : ""} />
      {clientesDisponibles.length === 0 ? (
        <p className="text-sm text-slate-600">
          Primero debes registrar un cliente activo.
        </p>
      ) : (
        <PerroForm
          formulario={formulario}
          clientes={clientesDisponibles}
          erroresCampos={erroresCampos}
          guardando={guardando}
          textoAccion="Guardar"
          onChange={setFormulario}
          onSubmit={guardar}
          onCancelar={() => router.push("/admin/perros")}
        />
      )}
    </div>
  );
}
