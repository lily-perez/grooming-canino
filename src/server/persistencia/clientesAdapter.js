import { solicitarMockApi } from "@/server/persistencia/mockApiClient";

const RECURSO_CLIENTES = "/clientes";

export function normalizarClientePersistido(cliente) {
  if (!cliente) {
    return null;
  }

  return {
    id: cliente.id,
    nombre: String(cliente.nombre ?? "").trim(),
    telefono: String(cliente.telefono ?? "").trim(),
    correo: String(cliente.correo ?? "").trim().toLowerCase(),
    observaciones: String(cliente.observaciones ?? "").trim(),
    activo: typeof cliente.activo === "boolean" ? cliente.activo : true,
  };
}

function payloadOficial(cliente) {
  return {
    nombre: cliente.nombre,
    telefono: cliente.telefono,
    correo: cliente.correo,
    observaciones: cliente.observaciones,
    activo: cliente.activo,
  };
}

export async function listarClientesPersistidos() {
  const clientes = await solicitarMockApi(RECURSO_CLIENTES);
  return Array.isArray(clientes)
    ? clientes.map(normalizarClientePersistido)
    : [];
}

export async function obtenerClientePersistido(id) {
  const cliente = await solicitarMockApi(
    `${RECURSO_CLIENTES}/${encodeURIComponent(id)}`,
  );
  return normalizarClientePersistido(cliente);
}

export async function crearClientePersistido(cliente) {
  const creado = await solicitarMockApi(RECURSO_CLIENTES, {
    method: "POST",
    body: JSON.stringify(payloadOficial(cliente)),
  });
  return normalizarClientePersistido(creado);
}

export async function actualizarClientePersistido(id, cambios) {
  const cliente = await obtenerClientePersistido(id);

  if (!cliente) {
    return null;
  }

  const actualizado = await solicitarMockApi(
    `${RECURSO_CLIENTES}/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      body: JSON.stringify({
        id: cliente.id,
        ...payloadOficial({ ...cliente, ...cambios }),
      }),
    },
  );

  return normalizarClientePersistido(actualizado);
}

export async function cambiarEstadoClientePersistido(id, activo) {
  const cliente = await obtenerClientePersistido(id);

  if (!cliente) {
    return null;
  }

  return actualizarClientePersistido(id, { ...cliente, activo });
}
