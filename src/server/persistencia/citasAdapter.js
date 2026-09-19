import { solicitarMockApi } from "@/server/persistencia/mockApiClient";
import { ESTADOS_CITA, extraerServicioIds } from "@/utils/validacionesCitas";

const RECURSO_CITAS = "/citas";

export function normalizarCitaPersistida(cita) {
  if (!cita) {
    return null;
  }

  const estado = ESTADOS_CITA.includes(cita.estado)
    ? cita.estado
    : "programada";

  return {
    id: cita.id,
    perroId: String(cita.perroId ?? "").trim(),
    servicioIds: extraerServicioIds(cita),
    fecha: String(cita.fecha ?? "").trim(),
    horaInicio: String(cita.horaInicio ?? "").trim(),
    horaFinEstimada: String(
      cita.horaFinEstimada ?? cita.horaFin ?? "",
    ).trim(),
    estado,
    observaciones: String(cita.observaciones ?? "").trim(),
  };
}

function payloadOficial(cita) {
  return {
    perroId: cita.perroId,
    servicioIds: cita.servicioIds,
    fecha: cita.fecha,
    horaInicio: cita.horaInicio,
    horaFinEstimada: cita.horaFinEstimada,
    estado: cita.estado,
    observaciones: cita.observaciones,
  };
}

export async function listarCitasPersistidas() {
  const citas = await solicitarMockApi(RECURSO_CITAS);
  return Array.isArray(citas) ? citas.map(normalizarCitaPersistida) : [];
}

export async function obtenerCitaPersistida(id) {
  const cita = await solicitarMockApi(
    `${RECURSO_CITAS}/${encodeURIComponent(id)}`,
  );
  return normalizarCitaPersistida(cita);
}

export async function crearCitaPersistida(cita) {
  const creada = await solicitarMockApi(RECURSO_CITAS, {
    method: "POST",
    body: JSON.stringify(payloadOficial(cita)),
  });
  return normalizarCitaPersistida(creada);
}

export async function actualizarCitaPersistida(id, cambios) {
  const cita = await obtenerCitaPersistida(id);

  if (!cita) {
    return null;
  }

  const actualizada = await solicitarMockApi(
    `${RECURSO_CITAS}/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      body: JSON.stringify({
        id: cita.id,
        ...payloadOficial({ ...cita, ...cambios }),
      }),
    },
  );

  return normalizarCitaPersistida(actualizada);
}

export async function cambiarEstadoCitaPersistida(id, estado) {
  const cita = await obtenerCitaPersistida(id);

  if (!cita) {
    return null;
  }

  return actualizarCitaPersistida(id, { ...cita, estado });
}
