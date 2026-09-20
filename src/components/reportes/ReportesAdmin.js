"use client";

import BotonExportarReporte from "@/components/reportes/BotonExportarReporte";
import GraficoTendencia from "@/components/reportes/GraficoTendencia";
import EmptyState from "@/components/shared/EmptyState";
import ErrorMessage from "@/components/shared/ErrorMessage";
import Loading from "@/components/shared/Loading";
import { useReportes } from "@/hooks/useReportes";
import { obtenerMensajeError } from "@/utils/errores";

const PERIODOS = [
  { valor: "semana", etiqueta: "Semana" },
  { valor: "mes", etiqueta: "Mes" },
];

function textoMetrica(metrica) {
  if (!metrica || !metrica.cantidad) {
    return "Sin datos";
  }

  return metrica.nombre;
}

export default function ReportesAdmin() {
  const { data, cargando, error, periodo, cambiarPeriodo, recargar } =
    useReportes("semana");
  const totalCitas =
    data?.citasPorDia?.reduce((acumulado, fila) => acumulado + fila.total, 0) ??
    0;
  const hayDatos = Boolean(data) && totalCitas > 0;

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Reportes y Estadísticas
          </h1>
          {data?.rango ? (
            <p className="mt-1 text-sm text-slate-500">
              Período {data.rango.inicio} — {data.rango.fin}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="no-imprimir flex flex-wrap gap-2">
            {PERIODOS.map((item) => (
              <button
                key={item.valor}
                type="button"
                onClick={() => cambiarPeriodo(item.valor)}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  periodo === item.valor
                    ? "bg-sky-700 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {item.etiqueta}
              </button>
            ))}
          </div>
          <BotonExportarReporte />
        </div>
      </div>

      {cargando ? <Loading mensaje="Cargando reportes..." /> : null}

      {error && !cargando ? (
        <div className="mb-6 space-y-3">
          <ErrorMessage mensaje={obtenerMensajeError(error)} />
          <button
            type="button"
            onClick={() => recargar(periodo).catch(() => {})}
            className="no-imprimir rounded-lg bg-sky-700 px-4 py-2 text-sm font-medium text-white hover:bg-sky-800"
          >
            Reintentar
          </button>
        </div>
      ) : null}

      {!cargando && !error && data ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 border-t-4 border-t-sky-500">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                Promedio Citas Diarias
              </p>
              <p className="text-4xl font-bold text-slate-800 mt-2">
                {data.metricas.promedioCitasDiarias.toFixed(1)}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 border-t-4 border-t-emerald-500">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                Servicio Más Solicitado
              </p>
              <p className="text-2xl font-bold text-slate-800 mt-3">
                {textoMetrica(data.metricas.servicioMasSolicitado)}
              </p>
              {data.metricas.servicioMasSolicitado.cantidad > 0 ? (
                <p className="mt-1 text-sm text-slate-500">
                  {data.metricas.servicioMasSolicitado.cantidad} solicitudes
                </p>
              ) : null}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 border-t-4 border-t-purple-500">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                Groomer con más atenciones
              </p>
              <p className="text-2xl font-bold text-slate-800 mt-3">
                {textoMetrica(data.metricas.groomerMasAtenciones)}
              </p>
              {data.metricas.groomerMasAtenciones.cantidad > 0 ? (
                <p className="mt-1 text-sm text-slate-500">
                  {data.metricas.groomerMasAtenciones.cantidad} atenciones
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold mb-4 text-slate-700">
                {periodo === "mes" ? "Tendencia Mensual" : "Tendencia Semanal"}
              </h2>
              <GraficoTendencia series={data.citasPorDia} />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-700">
                  Desglose de Citas por Día
                </h2>
              </div>
              {!hayDatos ? (
                <div className="p-6">
                  <EmptyState mensaje="No hay citas en el período seleccionado." />
                </div>
              ) : (
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                        Día / Fecha
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase">
                        Total
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-emerald-600 uppercase">
                        Completadas
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-red-500 uppercase">
                        Canceladas
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {data.citasPorDia.map((fila) => (
                      <tr
                        key={fila.fecha}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-900">
                            {fila.dia}
                          </div>
                          <div className="text-sm text-slate-500">
                            {fila.fecha}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-semibold text-slate-700">
                          {fila.total}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-emerald-600 font-medium">
                          {fila.completadas}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-red-500 font-medium">
                          {fila.canceladas}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      ) : null}

      {!cargando && !error && !data ? (
        <EmptyState mensaje="No hay información disponible para el reporte." />
      ) : null}
    </div>
  );
}
