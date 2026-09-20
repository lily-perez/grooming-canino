export default function ReportesAdmin() {
  // Datos simulados para la tabla de citas por día
  const citasPorDia = [
    { fecha: '2026-09-14', dia: 'Lunes', total: 10, completadas: 9, canceladas: 1 },
    { fecha: '2026-09-15', dia: 'Martes', total: 12, completadas: 12, canceladas: 0 },
    { fecha: '2026-09-16', dia: 'Miércoles', total: 8, completadas: 7, canceladas: 1 },
    { fecha: '2026-09-17', dia: 'Jueves', total: 15, completadas: 14, canceladas: 1 },
    { fecha: '2026-09-18', dia: 'Viernes', total: 18, completadas: 18, canceladas: 0 },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Reportes y Estadísticas</h1>
        <button className="bg-sky-700 hover:bg-sky-800 text-white px-4 py-2 rounded-lg text-sm transition font-medium">
          Exportar PDF
        </button>
      </div>

      {/* 1. ESTADÍSTICAS BÁSICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 border-t-4 border-t-sky-500">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Promedio Citas Diarias</p>
          <p className="text-4xl font-bold text-slate-800 mt-2">12.6</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 border-t-4 border-t-emerald-500">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Servicio Más Solicitado</p>
          <p className="text-2xl font-bold text-slate-800 mt-3">Baño y Corte Full</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 border-t-4 border-t-purple-500">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Groomer con más atenciones</p>
          <p className="text-2xl font-bold text-slate-800 mt-3">Marta R.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 2. GRÁFICA */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold mb-4 text-slate-700">Tendencia Semanal</h2>
          <div className="h-64 bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400">
            <svg className="w-12 h-12 mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
            </svg>
            <p className="font-medium">Espacio para gráfica de líneas</p>
            <p className="text-xs mt-1">(Se integrará Chart.js o Recharts)</p>
          </div>
        </div>

        {/* 3. CITAS POR DÍA (Tabla) */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-700">Desglose de Citas por Día</h2>
          </div>
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Día / Fecha</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Total</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-emerald-600 uppercase">Completadas</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-red-500 uppercase">Canceladas</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {citasPorDia.map((fila, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{fila.dia}</div>
                    <div className="text-sm text-slate-500">{fila.fecha}</div>
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
        </div>
      </div>
    </div>
  );
}