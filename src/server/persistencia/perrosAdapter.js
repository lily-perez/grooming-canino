import { solicitarMockApi } from "@/server/persistencia/mockApiClient";

const RECURSO_PERROS = "/perros";

export function normalizarPerroPersistido(perro) {
  if (!perro) {
    return null;
  }

  return {
    id: perro.id,
    clienteId: String(perro.clienteId ?? "").trim(),
    nombre: String(perro.nombre ?? "").trim(),
    raza: String(perro.raza ?? "").trim(),
    sexo: String(perro.sexo ?? "").trim(),
    fechaNacimiento: String(perro.fechaNacimiento ?? "").trim(),
    observaciones: String(perro.observaciones ?? "").trim(),
    activo: typeof perro.activo === "boolean" ? perro.activo : true,
  };
}

function payloadOficial(perro) {
  return {
    clienteId: perro.clienteId,
    nombre: perro.nombre,
    raza: perro.raza,
    sexo: perro.sexo,
    fechaNacimiento: perro.fechaNacimiento,
    observaciones: perro.observaciones,
    activo: perro.activo,
  };
}

export async function listarPerrosPersistidos() {
  const perros = await solicitarMockApi(RECURSO_PERROS);
  return Array.isArray(perros) ? perros.map(normalizarPerroPersistido) : [];
}

export async function obtenerPerroPersistido(id) {
  const perro = await solicitarMockApi(
    `${RECURSO_PERROS}/${encodeURIComponent(id)}`,
  );
  return normalizarPerroPersistido(perro);
}

export async function crearPerroPersistido(perro) {
  const creado = await solicitarMockApi(RECURSO_PERROS, {
    method: "POST",
    body: JSON.stringify(payloadOficial(perro)),
  });
  return normalizarPerroPersistido(creado);
}

export async function actualizarPerroPersistido(id, cambios) {
  const perro = await obtenerPerroPersistido(id);

  if (!perro) {
    return null;
  }

  const actualizado = await solicitarMockApi(
    `${RECURSO_PERROS}/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      body: JSON.stringify({
        id: perro.id,
        ...payloadOficial({ ...perro, ...cambios }),
      }),
    },
  );

  return normalizarPerroPersistido(actualizado);
}

export async function cambiarEstadoPerroPersistido(id, activo) {
  const perro = await obtenerPerroPersistido(id);

  if (!perro) {
    return null;
  }

  return actualizarPerroPersistido(id, { ...perro, activo });
}
