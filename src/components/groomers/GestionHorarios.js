"use client";

import { useEffect, useState } from "react";
import { groomersRepository } from "@/repositories/groomersRepository";
import { horariosRepository } from "@/repositories/horariosRepository";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { obtenerMensajeError } from "@/utils/errores";
import { DIAS_SEMANA } from "@/utils/tiempo";

const FORMULARIO_INICIAL = {
  diaSemana: "lunes",
  horaInicio: "09:00",
  horaFin: "17:00",
};

export default function GestionHorarios() {
  const [groomers, setGroomers] = useState([]);
  const [groomerId, setGroomerId] = useState("");
  const [horarios, setHorarios] = useState([]);
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    let activo = true;

    groomersRepository
      .listar({ activo: true })
      .then((data) => {
        if (!activo) return;
        setGroomers(data);
        setGroomerId((actual) => actual || data[0]?.id || "");
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
  }, []);

  useEffect(() => {
    if (!groomerId) {
      return undefined;
    }

    let activo = true;
    horariosRepository
      .listarPorGroomer(groomerId)
      .then((data) => {
        if (activo) {
          setHorarios(data);
        }
      })
      .catch((errorPeticion) => {
        if (activo) {
          setError(errorPeticion);
        }
      });

    return () => {
      activo = false;
    };
  }, [groomerId]);

  async function manejarSubmit(event) {
    event.preventDefault();
    if (!groomerId) return;

    setProcesando(true);
    setError(null);

    try {
      const creado = await horariosRepository.crear(groomerId, formulario);
      setHorarios((actuales) => [...actuales, creado]);
      setFormulario(FORMULARIO_INICIAL);
    } catch (errorPeticion) {
      setError(errorPeticion);
    } finally {
      setProcesando(false);
    }
  }

  async function alternarEstado(horario) {
    setProcesando(true);
    setError(null);

    try {
      const actualizado = await horariosRepository.cambiarEstado(
        horario.id,
        !horario.activo,
      );
      setHorarios((actuales) =>
        actuales.map((item) =>
          String(item.id) === String(horario.id) ? actualizado : item,
        ),
      );
    } catch (errorPeticion) {
      setError(errorPeticion);
    } finally {
      setProcesando(false);
    }
  }

  if (cargando) {
    return <p className="text-slate-500">Cargando Groomers...</p>;
  }

  return (
    <div className="space-y-6">
      {error ? <ErrorMessage mensaje={obtenerMensajeError(error)} /> : null}

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">Horarios de Groomer</h2>
        <p className="mt-1 text-sm text-slate-600">
          La disponibilidad se calcula con estos horarios activos y las Tareas ya asignadas.
        </p>

        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium text-slate-700">Groomer</label>
          <select
            value={groomerId}
            onChange={(event) => setGroomerId(event.target.value)}
            className="w-full max-w-md rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="">Selecciona un Groomer</option>
            {groomers.map((groomer) => (
              <option key={groomer.id} value={groomer.id}>
                {groomer.nombre}
              </option>
            ))}
          </select>
        </div>

        <form className="mt-5 grid gap-3 md:grid-cols-4" onSubmit={manejarSubmit}>
          <select
            value={formulario.diaSemana}
            onChange={(event) =>
              setFormulario((actual) => ({ ...actual, diaSemana: event.target.value }))
            }
            className="rounded-lg border border-slate-300 px-3 py-2"
          >
            {DIAS_SEMANA.map((dia) => (
              <option key={dia} value={dia}>
                {dia}
              </option>
            ))}
          </select>
          <input
            type="time"
            value={formulario.horaInicio}
            onChange={(event) =>
              setFormulario((actual) => ({ ...actual, horaInicio: event.target.value }))
            }
            className="rounded-lg border border-slate-300 px-3 py-2"
          />
          <input
            type="time"
            value={formulario.horaFin}
            onChange={(event) =>
              setFormulario((actual) => ({ ...actual, horaFin: event.target.value }))
            }
            className="rounded-lg border border-slate-300 px-3 py-2"
          />
          <button
            type="submit"
            disabled={procesando || !groomerId}
            className="rounded-lg bg-sky-700 px-4 py-2 font-medium text-white disabled:opacity-60"
          >
            {procesando ? "Guardando..." : "Agregar horario"}
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        {!groomerId || horarios.length === 0 ? (
          <p className="text-sm text-slate-500">
            Este Groomer no tiene horarios. Si el recurso `/horarios` no existe en MockAPI,
            la creación fallará hasta que se cree ese recurso.
          </p>
        ) : (
          <div className="space-y-3">
            {horarios.map((horario) => (
              <div
                key={horario.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3"
              >
                <p className="text-sm text-slate-700">
                  {horario.diaSemana} · {horario.horaInicio} - {horario.horaFin} ·{" "}
                  {horario.activo ? "activo" : "inactivo"}
                </p>
                <button
                  type="button"
                  disabled={procesando}
                  onClick={() => alternarEstado(horario)}
                  className="text-sm font-medium text-sky-700"
                >
                  {horario.activo ? "Desactivar" : "Activar"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
