import { solicitarMockApi } from "@/server/persistencia/mockApiClient";

// El recurso existente usa mayúscula. La diferencia queda encapsulada aquí.
const RECURSO_SERVICIOS = "/Servicios";

export function normalizarServicioPersistido(servicio) {
  if (!servicio) {
    return null;
  }

  return {
    id: servicio.id,
    nombre: String(servicio.nombre ?? "").trim(),
    descripcion: String(servicio.descripcion ?? "").trim(),
    duracionEstimadaMinutos: Number(
      servicio.duracionEstimadaMinutos ?? servicio.duracion ?? 0,
    ),
    activo: typeof servicio.activo === "boolean" ? servicio.activo : true,
  };
}

export async function listarServiciosPersistidos() {
  const servicios = await solicitarMockApi(RECURSO_SERVICIOS);
  return Array.isArray(servicios)
    ? servicios.map(normalizarServicioPersistido)
    : [];
}

export async function obtenerServicioPersistido(id) {
  const servicio = await solicitarMockApi(
    `${RECURSO_SERVICIOS}/${encodeURIComponent(id)}`,
  );
  return normalizarServicioPersistido(servicio);
}

export async function crearServicioPersistido(servicio) {
  const creado = await solicitarMockApi(RECURSO_SERVICIOS, {
    method: "POST",
    body: JSON.stringify(servicio),
  });
  return normalizarServicioPersistido(creado);
}

export async function actualizarServicioPersistido(id, cambios) {
  const servicio = await obtenerServicioPersistido(id);

  if (!servicio) {
    return null;
  }

  const actualizado = await solicitarMockApi(
    `${RECURSO_SERVICIOS}/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      body: JSON.stringify({
        id: servicio.id,
        nombre: cambios.nombre,
        descripcion: cambios.descripcion,
        duracionEstimadaMinutos: cambios.duracionEstimadaMinutos,
        activo: servicio.activo,
      }),
    },
  );

  return normalizarServicioPersistido(actualizado);
}

export async function cambiarEstadoServicioPersistido(id, activo) {
  const servicio = await obtenerServicioPersistido(id);

  if (!servicio) {
    return null;
  }

  const actualizado = await solicitarMockApi(
    `${RECURSO_SERVICIOS}/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      body: JSON.stringify({ ...servicio, activo }),
    },
  );

  return normalizarServicioPersistido(actualizado);
}
