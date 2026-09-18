import Link from 'next/link';

export default function HistorialAdmin() {
  const registros = [
    { id: 1, fecha: '2026-09-15', perro: 'Max', raza: 'Golden Retriever', cliente: 'Ana Silva', groomer: 'Carlos M.', estado: 'Completado' },
    { id: 2, fecha: '2026-09-16', perro: 'Bella', raza: 'Poodle', cliente: 'Luis Gomez', groomer: 'Marta R.', estado: 'Completado' },
    { id: 3, fecha: '2026-09-17', perro: 'Rocky', raza: 'Bulldog', cliente: 'Sofía Castro', groomer: 'Carlos M.', estado: 'Completado' },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Historial de Atención</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mascota</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Groomer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {registros.map((registro) => (
              <tr key={registro.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{registro.fecha}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="font-medium">{registro.perro}</span> <br/>
                  <span className="text-gray-500 text-xs">{registro.raza}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{registro.cliente}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{registro.groomer}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {registro.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/admin/historial/${registro.id}`} className="text-blue-600 hover:text-blue-900">
                    Ver Detalle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {registros.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No hay registros en el historial todavía.
          </div>
        )}
      </div>
    </div>
  );
}