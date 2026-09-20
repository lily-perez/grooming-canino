"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PerroForm, { FORMULARIO_PERRO_INICIAL } from "@/components/perros/PerroForm";
import EmptyState from "@/components/shared/EmptyState";
import ErrorMessage from "@/components/shared/ErrorMessage";
import Loading from "@/components/shared/Loading";
import { clientesRepository } from "@/repositories/clientesRepository";
import { citasRepository } from "@/repositories/citasRepository";
import { perrosRepository } from "@/repositories/perrosRepository";
import { tieneErroresPerro, validarPerro } from "@/utils/validacionesPerros";
import { obtenerMensajeError } from "@/utils/errores";

export default function DetallePerro({ perroId }) {
  const [perro, setPerro] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [citas, setCitas] = useState([]);
  const [formulario, setFormulario] = useState(FORMULARIO_PERRO_INICIAL);
  const [erroresCampos, setErroresCampos] = useState({});
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;

    Promise.all([
      perrosRepository.obtener(perroId),
      clientesRepository.listar(),
      citasRepository.listar({ perroId }),
    ])
      .then(([perroActual, clientesActuales, citasActuales]) => {
        if (!activo) {
          return;
        }

        const clienteActual =
          clientesActuales.find(
            (item) => String(item.id) === String(perroActual.clienteId),
          ) || null;

        setPerro(perroActual);
        setClientes(clientesActuales);
        setCliente(clienteActual);
        setCitas(citasActuales);
        setFormulario({
          clienteId: perroActual.clienteId,
          nombre: perroActual.nombre,
          raza: perroActual.raza || "",
          sexo: perroActual.sexo || "",
          fechaNacimiento: perroActual.fechaNacimiento || "",
          observaciones: perroActual.observaciones || "",
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
  }, [perroId]);

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
      const actualizado = await perrosRepository.actualizar(
        perroId,
        validacion.datos,
      );
      setPerro(actualizado);
      setCliente(
        clientes.find((item) => String(item.id) === String(actualizado.clienteId)) ||
          null,
      );
    } catch (errorPeticion) {
      setErroresCampos(errorPeticion.erroresCampos || {});
      setError(errorPeticion);
    } finally {
      setGuardando(false);
    }
  }

  async function alternarEstado() {
    if (perro.activo && !window.confirm("¿Deseas desactivar este perro?")) {
      return;
    }

    setGuardando(true);
    setError(null);

    try {
      const actualizado = await perrosRepository.cambiarEstado(
        perroId,
        !perro.activo,
      );
      setPerro(actualizado);
    } catch (errorPeticion) {
      setError(errorPeticion);
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return <Loading mensaje="Cargando perro..." />;
  }

  if (error && !perro) {
    return <ErrorMessage mensaje={obtenerMensajeError(error)} />;
  }

  return (
    <div className="space-y-6">
      <ErrorMessage mensaje={error && perro ? obtenerMensajeError(error) : ""} />

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{perro.nombre}</h2>
            <p className="text-sm text-slate-600">
              {perro.activo ? "Perro activo" : "Perro inactivo"}
              {cliente ? ` · Cliente: ${cliente.nombre}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {perro.activo ? (
              <Link
                href={`/admin/citas?perroId=${perro.id}`}
                className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-medium text-white hover:bg-sky-800"
              >
                Crear cita
              </Link>
            ) : null}
            <button
              type="button"
              onClick={alternarEstado}
              disabled={guardando}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-60"
            >
              {perro.activo ? "Desactivar perro" : "Activar perro"}
            </button>
          </div>
        </div>

        {cliente ? (
          <p className="mb-4 text-sm text-slate-600">
            Cliente asociado:{" "}
            <Link
              href={`/admin/clientes/${cliente.id}`}
              className="font-medium text-sky-700 hover:text-sky-900"
            >
              {cliente.nombre}
            </Link>
          </p>
        ) : (
          <p className="mb-4 text-sm text-red-700">
            El cliente asociado no está disponible.
          </p>
        )}

        <PerroForm
          formulario={formulario}
          clientes={clientes}
          erroresCampos={erroresCampos}
          guardando={guardando}
          textoAccion="Guardar cambios"
          onChange={setFormulario}
          onSubmit={guardar}
        />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">Citas relacionadas</h2>
        <p className="mt-1 text-sm text-slate-600">
          El historial de atención se implementará en un incremento posterior.
        </p>

        {citas.length === 0 ? (
          <div className="mt-4">
            <EmptyState mensaje="Este perro todavía no tiene citas registradas." />
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {citas.map((cita) => (
              <li
                key={cita.id}
                className="rounded-lg border border-slate-200 px-4 py-3 text-sm"
              >
                <p className="font-medium text-slate-900">
                  {cita.fecha} · {cita.horaInicio} - {cita.horaFinEstimada}
                </p>
                <p className="text-slate-600">{cita.estado}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
