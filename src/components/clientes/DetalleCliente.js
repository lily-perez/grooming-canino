"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ClienteForm, {
  FORMULARIO_CLIENTE_INICIAL,
} from "@/components/clientes/ClienteForm";
import EmptyState from "@/components/shared/EmptyState";
import ErrorMessage from "@/components/shared/ErrorMessage";
import Loading from "@/components/shared/Loading";
import { clientesRepository } from "@/repositories/clientesRepository";
import { perrosRepository } from "@/repositories/perrosRepository";
import {
  tieneErroresCliente,
  validarCliente,
} from "@/utils/validacionesClientes";
import { obtenerMensajeError } from "@/utils/errores";

export default function DetalleCliente({ clienteId }) {
  const [cliente, setCliente] = useState(null);
  const [perros, setPerros] = useState([]);
  const [formulario, setFormulario] = useState(FORMULARIO_CLIENTE_INICIAL);
  const [erroresCampos, setErroresCampos] = useState({});
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;

    Promise.all([
      clientesRepository.obtener(clienteId),
      perrosRepository.listar({ clienteId }),
    ])
      .then(([clienteActual, perrosActuales]) => {
        if (!activo) {
          return;
        }

        setCliente(clienteActual);
        setPerros(perrosActuales);
        setFormulario({
          nombre: clienteActual.nombre,
          telefono: clienteActual.telefono,
          correo: clienteActual.correo || "",
          observaciones: clienteActual.observaciones || "",
        });
      })
      .catch((errorPeticion) => {
        if (activo) {
          setError(errorPeticion);
        }
      })
      .finally(() => {
        if (activo) {
          setCargando(false);
        }
      });

    return () => {
      activo = false;
    };
  }, [clienteId]);

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
      const actualizado = await clientesRepository.actualizar(
        clienteId,
        validacion.datos,
      );
      setCliente(actualizado);
    } catch (errorPeticion) {
      setErroresCampos(errorPeticion.erroresCampos || {});
      setError(errorPeticion);
    } finally {
      setGuardando(false);
    }
  }

  async function alternarEstado() {
    if (
      cliente.activo &&
      !window.confirm("¿Deseas desactivar este cliente?")
    ) {
      return;
    }

    setGuardando(true);
    setError(null);

    try {
      const actualizado = await clientesRepository.cambiarEstado(
        clienteId,
        !cliente.activo,
      );
      setCliente(actualizado);
    } catch (errorPeticion) {
      setError(errorPeticion);
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return <Loading mensaje="Cargando cliente..." />;
  }

  if (error && !cliente) {
    return <ErrorMessage mensaje={obtenerMensajeError(error)} />;
  }

  return (
    <div className="space-y-6">
      <ErrorMessage mensaje={error && cliente ? obtenerMensajeError(error) : ""} />

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {cliente.nombre}
            </h2>
            <p className="text-sm text-slate-600">
              {cliente.activo ? "Cliente activo" : "Cliente inactivo"}
            </p>
          </div>
          <button
            type="button"
            onClick={alternarEstado}
            disabled={guardando}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-60"
          >
            {cliente.activo ? "Desactivar cliente" : "Activar cliente"}
          </button>
        </div>

        <ClienteForm
          formulario={formulario}
          erroresCampos={erroresCampos}
          guardando={guardando}
          textoAccion="Guardar cambios"
          onChange={setFormulario}
          onSubmit={guardar}
        />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-slate-900">
            Perros asociados
          </h2>
          {cliente.activo ? (
            <Link
              href={`/admin/perros/nuevo?clienteId=${cliente.id}`}
              className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-medium text-white hover:bg-sky-800"
            >
              Registrar perro
            </Link>
          ) : (
            <p className="text-sm text-slate-500">
              Activa el cliente para registrar un perro nuevo.
            </p>
          )}
        </div>

        {perros.length === 0 ? (
          <EmptyState mensaje="Este cliente todavía no tiene perros registrados." />
        ) : (
          <ul className="space-y-2">
            {perros.map((perro) => (
              <li
                key={perro.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-slate-900">{perro.nombre}</p>
                  <p className="text-sm text-slate-600">
                    {perro.raza || "Sin raza"} ·{" "}
                    {perro.activo ? "Activo" : "Inactivo"}
                  </p>
                </div>
                <Link
                  href={`/admin/perros/${perro.id}`}
                  className="text-sm font-medium text-sky-700 hover:text-sky-900"
                >
                  Ver perro
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
