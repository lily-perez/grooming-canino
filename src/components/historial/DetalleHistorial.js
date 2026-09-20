"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RegistroAtencionForm, {
  observacionesDesdeRegistro,
} from "@/components/historial/RegistroAtencionForm";
import ErrorMessage from "@/components/shared/ErrorMessage";
import Loading from "@/components/shared/Loading";
import { historialRepository } from "@/repositories/historialRepository";
import { obtenerMensajeError } from "@/utils/errores";

export default function DetalleHistorial({ registroId }) {
  const [registro, setRegistro] = useState(null);
  const [formulario, setFormulario] = useState(observacionesDesdeRegistro(null));
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState("");

  useEffect(() => {
    let activo = true;

    historialRepository
      .obtener(registroId)
      .then((datos) => {
        if (!activo) {
          return;
        }

        setRegistro(datos);
        setFormulario(observacionesDesdeRegistro(datos));
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
  }, [registroId]);

  async function guardar(event) {
    event.preventDefault();
    setGuardando(true);
    setError(null);
    setMensajeExito("");

    try {
      const actualizado = await historialRepository.actualizar(
        registroId,
        formulario,
      );
      setRegistro(actualizado);
      setFormulario(observacionesDesdeRegistro(actualizado));
      setMensajeExito("Registro de atención actualizado correctamente.");
    } catch (errorPeticion) {
      setError(errorPeticion);
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return <Loading mensaje="Cargando registro de atención..." />;
  }

  if (error && !registro) {
    return <ErrorMessage mensaje={obtenerMensajeError(error)} />;
  }

  return (
    <div className="space-y-6">
      {mensajeExito ? (
        <div
          role="status"
          className="rounded-md border border-green-400 bg-green-100 p-4 text-sm text-green-700"
        >
          {mensajeExito}
        </div>
      ) : null}
      {error && registro ? (
        <ErrorMessage mensaje={obtenerMensajeError(error)} />
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Registro de atención
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Fecha del registro: {registro.fecha || "—"}
          </p>
        </div>

        <dl className="grid gap-3 text-sm md:grid-cols-2">
          <div>
            <dt className="font-medium text-slate-500">Perro</dt>
            <dd className="mt-1 text-slate-800">
              {registro.perro ? (
                <Link
                  href={`/admin/perros/${registro.perro.id}`}
                  className="font-medium text-sky-700 hover:text-sky-900"
                >
                  {registro.perro.nombre}
                </Link>
              ) : (
                "Perro no disponible"
              )}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Cliente</dt>
            <dd className="mt-1 text-slate-800">
              {registro.cliente?.nombre || "Cliente no disponible"}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Cita</dt>
            <dd className="mt-1 text-slate-800">
              {registro.cita
                ? `${registro.cita.fecha} · ${registro.cita.horaInicio} - ${registro.cita.horaFinEstimada} · ${registro.cita.estado}`
                : registro.citaId}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Registrado por</dt>
            <dd className="mt-1 text-slate-800">
              {registro.registradoPor?.nombre || "Usuario no disponible"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">
          Observaciones
        </h2>
        <RegistroAtencionForm
          formulario={formulario}
          erroresCampos={error?.erroresCampos || {}}
          guardando={guardando}
          textoAccion="Guardar cambios"
          onChange={setFormulario}
          onSubmit={guardar}
        />
      </section>
    </div>
  );
}
