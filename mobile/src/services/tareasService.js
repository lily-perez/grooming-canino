import { apiGet, apiPatch } from './apiClient';
import { formatearFecha, nombreCompleto } from '../utils/formato';

function mapaPorId(lista) {
  return new Map((lista ?? []).map((item) => [String(item.id), item]));
}

// Pide varios recursos por id; si alguno falla, simplemente no se incluye.
async function traerPorIds(rutaBase, ids) {
  const resultados = await Promise.allSettled(
    ids.map((id) => apiGet(`${rutaBase}/${encodeURIComponent(id)}`)),
  );

  return mapaPorId(
    resultados
      .filter((r) => r.status === 'fulfilled' && r.value)
      .map((r) => r.value),
  );
}

function unicos(valores) {
  return [...new Set(valores.filter(Boolean).map(String))];
}

export async function obtenerMisTareas() {
  const [tareas, citas, servicios] = await Promise.all([
    apiGet('/api/tareas/mias'),
    apiGet('/api/citas'),
    apiGet('/api/servicios'),
  ]);

  const citasPorId = mapaPorId(citas);
  const serviciosPorId = mapaPorId(servicios);

  const perros = await traerPorIds(
    '/api/perros',
    unicos((citas ?? []).map((c) => c.perroId)),
  );
  const clientes = await traerPorIds(
    '/api/clientes',
    unicos([...perros.values()].map((p) => p.clienteId)),
  );

  return (tareas ?? [])
    .map((tarea) => {
      const cita = citasPorId.get(String(tarea.citaId));
      const servicio = serviciosPorId.get(String(tarea.servicioId));
      const perro = cita ? perros.get(String(cita.perroId)) : null;
      const cliente = perro ? clientes.get(String(perro.clienteId)) : null;

      return {
        id: String(tarea.id),
        citaId: String(tarea.citaId),
        nombre: tarea.nombre,
        servicio: servicio?.nombre ?? 'Servicio',
        estado: tarea.estado,
        horaInicio: tarea.horaInicio,
        horaFin: tarea.horaFin,
        observaciones: tarea.observaciones,
        fecha: cita?.fecha ?? '',
        fechaTexto: formatearFecha(cita?.fecha),
        citaEstado: cita?.estado ?? '',
        perro: perro?.nombre ?? 'Mascota',
        raza: perro?.raza ?? '',
        cliente: nombreCompleto(cliente) || 'Cliente',
      };
    })
    .sort((a, b) =>
      `${a.fecha} ${a.horaInicio}`.localeCompare(`${b.fecha} ${b.horaInicio}`),
    );
}

export async function actualizarEstadoTarea(tareaId, estado) {
  return apiPatch(`/api/tareas/${encodeURIComponent(tareaId)}/estado`, {
    estado,
  });
}