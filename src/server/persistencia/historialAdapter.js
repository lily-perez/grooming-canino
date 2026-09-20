import { solicitarMockApi } from "@/server/persistencia/mockApiClient";

const RECURSO_HISTORIAL = "/historial";

export const CAMPOS_OBSERVACION = [
  "ojos",
  "oidos",
  "dientes",
  "pelaje",
  "comportamiento",
  "unas",
  "puntualidad",
  "observaciones",
];

export function normalizarRegistroAtencionPersistido(registro) {
  if (!registro) {
    return null;
  }

  const observaciones = {};

  for (const campo of CAMPOS_OBSERVACION) {
    observaciones[campo] = String(registro[campo] ?? "").trim();
  }

  return {
    id: registro.id,
    citaId: String(registro.citaId ?? "").trim(),
    perroId: String(registro.perroId ?? "").trim(),
    registradoPorUsuarioId: String(registro.registradoPorUsuarioId ?? "").trim(),
    ...observaciones,
    fecha: String(registro.fecha ?? "").trim(),
  };
}

function payloadOficial(registro) {
  const observaciones = {};

  for (const campo of CAMPOS_OBSERVACION) {
    observaciones[campo] = registro[campo] || "";
  }

  return {
    citaId: registro.citaId,
    perroId: registro.perroId,
    registradoPorUsuarioId: registro.registradoPorUsuarioId,
    ...observaciones,
    fecha: registro.fecha,
  };
}

export async function listarRegistrosAtencionPersistidos() {
  const registros = await solicitarMockApi(RECURSO_HISTORIAL);
  return Array.isArray(registros)
    ? registros.map(normalizarRegistroAtencionPersistido)
    : [];
}

export async function obtenerRegistroAtencionPersistido(id) {
  const registro = await solicitarMockApi(
    `${RECURSO_HISTORIAL}/${encodeURIComponent(id)}`,
  );
  return normalizarRegistroAtencionPersistido(registro);
}

export async function obtenerRegistroAtencionPorCitaId(citaId) {
  const registros = await listarRegistrosAtencionPersistidos();
  return (
    registros.find(
      (registro) => String(registro.citaId) === String(citaId),
    ) || null
  );
}

export async function crearRegistroAtencionPersistido(registro) {
  const creado = await solicitarMockApi(RECURSO_HISTORIAL, {
    method: "POST",
    body: JSON.stringify(payloadOficial(registro)),
  });
  return normalizarRegistroAtencionPersistido(creado);
}

export async function actualizarRegistroAtencionPersistido(id, cambios) {
  const registro = await obtenerRegistroAtencionPersistido(id);

  if (!registro) {
    return null;
  }

  const actualizado = await solicitarMockApi(
    `${RECURSO_HISTORIAL}/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      body: JSON.stringify({
        id: registro.id,
        ...payloadOficial({ ...registro, ...cambios }),
      }),
    },
  );

  return normalizarRegistroAtencionPersistido(actualizado);
}

export async function eliminarRegistroAtencionPersistido(id) {
  await solicitarMockApi(`${RECURSO_HISTORIAL}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
