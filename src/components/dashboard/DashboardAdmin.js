"use client";

import { useState } from "react";
import Link from "next/link";
import ActividadReciente from "@/components/dashboard/ActividadReciente";
import ClientesFrecuentes from "@/components/dashboard/ClientesFrecuentes";
import GraficoCitasPorDia from "@/components/dashboard/GraficoCitasPorDia";
import ServiciosSolicitados from "@/components/dashboard/ServiciosSolicitados";
import TarjetaMetrica from "@/components/dashboard/TarjetaMetrica";
import EmptyState from "@/components/shared/EmptyState";
import ErrorMessage from "@/components/shared/ErrorMessage";
import Loading from "@/components/shared/Loading";
import { useDashboard } from "@/hooks/useDashboard";
import { obtenerMensajeError } from "@/utils/errores";

const PERIODOS = [
  { valor: "hoy", etiqueta: "Hoy" },
  { valor: "semana", etiqueta: "Semana" },
  { valor: "mes", etiqueta: "Mes" },
];

export default function DashboardAdmin() {
  const { data, cargando, error, periodo, cambiarPeriodo, recargar } = useDashboard("mes");
  const [busqueda, setBusqueda] = useState("");

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Administrativo</h1>
          <p className="mt-1 text-sm text-gray-500">
            Resumen calculado a partir de Citas, Tareas, Servicios, Clientes y Perros.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {PERIODOS.map((item) => (
            <button
              key={item.valor}
              type="button"
              onClick={() => cambiarPeriodo(item.valor)}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                periodo === item.valor
                  ? "bg-sky-700 text-white"
                  : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {item.etiqueta}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin/citas"
          className="rounded-lg bg-sky-700 px-3 py-2 text-sm font-medium text-white hover:bg-sky-800"
        >
          Ver citas
        </Link>
        <Link
          href="/admin/citas"
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Crear cita
        </Link>
        <Link
          href="/admin/historial"
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Ver historial
        </Link>
      </div>

      {cargando ? <Loading mensaje="Cargando resumen del Dashboard..." /> : null}

      {error && !cargando ? (
        <div className="mb-6 space-y-3">
          <ErrorMessage mensaje={obtenerMensajeError(error)} />
          <button
            type="button"
            onClick={() => recargar(periodo).catch(() => {})}
            className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-medium text-white hover:bg-sky-800"
          >
            Reintentar
          </button>
        </div>
      ) : null}

      {!cargando && !error && data ? (
        <>
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <TarjetaMetrica
              titulo="Citas de Hoy"
              valor={data.metricas.citasHoy}
              acento="border-blue-500"
            />
            <TarjetaMetrica
              titulo="Citas de la Semana"
              valor={data.metricas.citasSemana}
              acento="border-sky-500"
            />
            <TarjetaMetrica
              titulo="Citas del Mes"
              valor={data.metricas.citasMes}
              acento="border-indigo-500"
            />
            <TarjetaMetrica
              titulo="Tareas Activas"
              valor={data.metricas.tareasActivas}
              acento="border-purple-500"
            />
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <TarjetaMetrica
              titulo="Programadas"
              valor={data.metricas.programadas}
              acento="border-yellow-500"
            />
            <TarjetaMetrica
              titulo="En proceso"
              valor={data.metricas.enProceso}
              acento="border-amber-500"
            />
            <TarjetaMetrica
              titulo="Completadas"
              valor={data.metricas.completadas}
              acento="border-green-500"
            />
            <TarjetaMetrica
              titulo="Canceladas"
              valor={data.metricas.canceladas}
              acento="border-rose-500"
            />
          </div>

          <div className="mb-8 grid gap-6 xl:grid-cols-2">
            <section className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">
                Servicios más solicitados
              </h2>
              <ServiciosSolicitados servicios={data.serviciosMasSolicitados} />
            </section>
            <section className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">
                Clientes más frecuentes
              </h2>
              <ClientesFrecuentes clientes={data.clientesMasFrecuentes} />
            </section>
          </div>

          <section className="mb-8 rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Citas por día
            </h2>
            <GraficoCitasPorDia series={data.citasPorDia} />
          </section>

          <section className="mb-8 rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Próximas Citas
            </h2>
            {data.proximasCitas.length === 0 ? (
              <EmptyState mensaje="No hay citas próximas programadas o en proceso." />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-gray-200 text-gray-500">
                    <tr>
                      <th className="py-2 pr-3 font-medium">Fecha</th>
                      <th className="py-2 pr-3 font-medium">Horario</th>
                      <th className="py-2 pr-3 font-medium">Perro</th>
                      <th className="py-2 pr-3 font-medium">Cliente</th>
                      <th className="py-2 font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.proximasCitas.map((cita) => (
                      <tr key={cita.id} className="border-b border-gray-100 last:border-0">
                        <td className="py-2 pr-3 text-gray-800">{cita.fecha}</td>
                        <td className="py-2 pr-3 text-gray-800">
                          {cita.horario}
                        </td>
                        <td className="py-2 pr-3 text-gray-800">{cita.perroNombre}</td>
                        <td className="py-2 pr-3 text-gray-800">{cita.clienteNombre}</td>
                        <td className="py-2 uppercase text-gray-600">{cita.estado}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Actividad reciente
            </h2>
            <ActividadReciente
              items={data.actividadReciente}
              busqueda={busqueda}
              onBuscar={setBusqueda}
            />
          </section>
        </>
      ) : null}

      {!cargando && !error && !data ? (
        <EmptyState mensaje="No hay información disponible para el Dashboard." />
      ) : null}
    </div>
  );
}
