import { solicitarMockApi } from "@/server/persistencia/mockApiClient";
import { ESTADOS_TAREA } from "@/utils/validacionesServiciosTareas";

const RECURSO_TAREAS = "/tareas";

export function normalizarTareaPersistida(tarea) {
  if (!tarea) {
    return null;
  }

  const estadoAnterior = tarea.completada ? "completada" : "pendiente";
  const estado = ESTADOS_TAREA.includes(tarea.estado)
    ? tarea.estado
    : estadoAnterior;

  return {
    id: tarea.id,
    citaId: String(tarea.citaId ?? "").trim(),
    servicioId: String(tarea.servicioId ?? "").trim(),
    nombre: String(tarea.nombre ?? "").trim(),
    groomerId: String(tarea.groomerId ?? "").trim(),
    horaInicio: String(tarea.horaInicio ?? "").trim(),
    horaFin: String(tarea.horaFin ?? "").trim(),
    estado,
    observaciones: String(
      tarea.observaciones ?? tarea.descripcion ?? "",
    ).trim(),
  };
}

export async function listarTareasPersistidas() {
  const tareas = await solicitarMockApi(RECURSO_TAREAS);
  return Array.isArray(tareas) ? tareas.map(normalizarTareaPersistida) : [];
}

export async function obtenerTareaPersistida(id) {
  const tarea = await solicitarMockApi(
    `${RECURSO_TAREAS}/${encodeURIComponent(id)}`,
  );
  return normalizarTareaPersistida(tarea);
}

export async function crearTareaPersistida(tarea) {
  const creada = await solicitarMockApi(RECURSO_TAREAS, {
    method: "POST",
    body: JSON.stringify(tarea),
  });
  return normalizarTareaPersistida(creada);
}

export async function actualizarTareaPersistida(id, cambios) {
  const tarea = await obtenerTareaPersistida(id);

  if (!tarea) {
    return null;
  }

  const actualizada = await solicitarMockApi(
    `${RECURSO_TAREAS}/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      body: JSON.stringify({
        id: tarea.id,
        ...cambios,
        estado: tarea.estado,
      }),
    },
  );

  return normalizarTareaPersistida(actualizada);
}

export async function cambiarEstadoTareaPersistida(id, estado) {
  const tarea = await obtenerTareaPersistida(id);

  if (!tarea) {
    return null;
  }

  const actualizada = await solicitarMockApi(
    `${RECURSO_TAREAS}/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      body: JSON.stringify({ ...tarea, estado }),
    },
  );

  return normalizarTareaPersistida(actualizada);
}
