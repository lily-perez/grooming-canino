"use client";

import Link from "next/link";
import { useMemo } from "react";

import { useAuth } from "@/hooks/useAuth";
import { useServicios } from "@/context/ServiciosContext";

function TarjetaResumen({
  titulo,
  valor,
  descripcion,
  estilo,
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 shadow-sm ${estilo}`}
    >
      <div className="relative z-10">
        <p className="text-sm font-semibold text-slate-600">
          {titulo}
        </p>

        <p className="mt-3 text-4xl font-black text-slate-900">
          {valor}
        </p>

        <p className="mt-2 text-xs leading-5 text-slate-500">
          {descripcion}
        </p>
      </div>

      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/40" />
    </div>
  );
}

function etiquetaEstado(estado) {
  if (estado === "completada") return "Completada";
  if (estado === "en_proceso") return "En proceso";
  return "Pendiente";
}

function claseEstado(estado) {
  if (estado === "completada") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (estado === "en_proceso") {
    return "bg-sky-100 text-sky-700";
  }

  return "bg-amber-100 text-amber-700";
}

export default function GroomerDashboardContent() {
  const { usuario } = useAuth();

  const {
    tareas,
    servicios,
    loading,
    error,
  } = useServicios();

  const resumen = useMemo(() => {
    const pendientes = tareas.filter(
      (tarea) => tarea.estado === "pendiente",
    ).length;

    const enProceso = tareas.filter(
      (tarea) => tarea.estado === "en_proceso",
    ).length;

    const completadas = tareas.filter(
      (tarea) => tarea.estado === "completada",
    ).length;

    return {
      total: tareas.length,
      pendientes,
      enProceso,
      completadas,
    };
  }, [tareas]);

  const porcentajeCompletado =
    resumen.total > 0
      ? Math.round(
          (resumen.completadas / resumen.total) * 100,
        )
      : 0;

  const tareasOrdenadas = useMemo(() => {
    return [...tareas]
      .sort((a, b) => {
        const fechaA = `${a.fecha ?? ""} ${
          a.horaInicio ?? ""
        }`;

        const fechaB = `${b.fecha ?? ""} ${
          b.horaInicio ?? ""
        }`;

        return fechaA.localeCompare(fechaB);
      })
      .slice(0, 5);
  }, [tareas]);

  function servicioDe(tarea) {
    return servicios.find(
      (servicio) =>
        String(servicio.id) ===
        String(tarea.servicioId),
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-600" />

          <p className="mt-4 text-sm text-slate-500">
            Cargando tu jornada...
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 to-orange-500 px-6 py-7 text-white shadow-lg md:px-8">
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-100">
              Panel del Groomer
            </p>

            <h1 className="mt-2 text-3xl font-black md:text-4xl">
              Hola, {usuario?.nombre || "Groomer"} 👋
            </h1>

            <p className="mt-2 max-w-xl text-sm text-amber-50 md:text-base">
              Revisa tus tareas asignadas y el progreso
              de las atenciones del día.
            </p>
          </div>

          <Link
            href="/groomer/servicios"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-amber-700 shadow-sm transition hover:bg-amber-50"
          >
            Ver mis tareas
          </Link>
        </div>

        <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-white/10" />
        <div className="absolute -bottom-28 right-32 h-56 w-56 rounded-full bg-white/10" />
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TarjetaResumen
          titulo="Tareas asignadas"
          valor={resumen.total}
          descripcion="Total de tareas de tu jornada."
          estilo="border-slate-200 bg-white"
        />

        <TarjetaResumen
          titulo="Pendientes"
          valor={resumen.pendientes}
          descripcion="Atenciones que todavía no has iniciado."
          estilo="border-amber-200 bg-amber-50"
        />

        <TarjetaResumen
          titulo="En proceso"
          valor={resumen.enProceso}
          descripcion="Servicios que estás atendiendo."
          estilo="border-sky-200 bg-sky-50"
        />

        <TarjetaResumen
          titulo="Completadas"
          valor={resumen.completadas}
          descripcion="Atenciones finalizadas correctamente."
          estilo="border-emerald-200 bg-emerald-50"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[2fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Mis próximas tareas
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Próximas atenciones asignadas.
              </p>
            </div>

            <Link
              href="/groomer/servicios"
              className="text-sm font-bold text-amber-700 hover:text-amber-900"
            >
              Ver todas →
            </Link>
          </div>

          {tareasOrdenadas.length === 0 ? (
            <div className="flex min-h-[250px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-2xl">
                🐾
              </div>

              <p className="mt-4 font-semibold text-slate-700">
                No tienes tareas asignadas
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Cuando recibas una asignación aparecerá aquí.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {tareasOrdenadas.map((tarea) => {
                const servicio = servicioDe(tarea);

                return (
                  <div
                    key={tarea.id}
                    className="flex flex-col gap-3 px-6 py-4 transition hover:bg-slate-50 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-xl">
                        ✂️
                      </div>

                      <div>
                        <p className="font-bold text-slate-800">
                          {tarea.nombre || "Atención"}
                        </p>

                        <p className="mt-0.5 text-sm text-slate-500">
                          {servicio?.nombre ||
                            tarea.servicio ||
                            "Servicio"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {tarea.fecha || "Sin fecha"} ·{" "}
                          {tarea.horaInicio || "--:--"} -{" "}
                          {tarea.horaFin || "--:--"}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${claseEstado(
                        tarea.estado,
                      )}`}
                    >
                      {etiquetaEstado(tarea.estado)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900">
                Progreso de jornada
              </h2>

              <span className="text-2xl font-black text-amber-600">
                {porcentajeCompletado}%
              </span>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-amber-500 transition-all"
                style={{
                  width: `${porcentajeCompletado}%`,
                }}
              />
            </div>

            <p className="mt-3 text-sm text-slate-500">
              {resumen.completadas} de {resumen.total} tareas completadas.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <p className="text-sm font-semibold text-amber-700">
              Servicios disponibles
            </p>

            <p className="mt-2 text-4xl font-black text-slate-900">
              {servicios.length}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Servicios activos en el catálogo.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Mi cuenta
            </p>

            <p className="mt-2 truncate font-bold text-slate-900">
              {usuario?.nombre || "Groomer"}
            </p>

            <p className="mt-1 truncate text-sm text-slate-500">
              {usuario?.correo || "Correo no disponible"}
            </p>

            <span className="mt-4 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              Cuenta activa
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}