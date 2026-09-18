export default function DashboardAdmin() {
  const metricas = {
    citasHoy: 8,
    pendientes: 3,
    completadas: 5,
    tareasActivas: 12
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard Administrativo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm font-medium">Citas de Hoy</p>
          <p className="text-3xl font-bold text-gray-800">{metricas.citasHoy}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <p className="text-gray-500 text-sm font-medium">Pendientes</p>
          <p className="text-3xl font-bold text-gray-800">{metricas.pendientes}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-gray-500 text-sm font-medium">Completadas</p>
          <p className="text-3xl font-bold text-gray-800">{metricas.completadas}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <p className="text-gray-500 text-sm font-medium">Tareas Pendientes</p>
          <p className="text-3xl font-bold text-gray-800">{metricas.tareasActivas}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Próximas Citas</h2>
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded p-8 text-center">
          <p className="text-gray-500">Aquí construiremos la tabla de citas en el siguiente paso.</p>
        </div>
      </div>
    </div>
  );
}