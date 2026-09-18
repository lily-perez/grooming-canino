import { solicitarMockApi } from "@/server/persistencia/mockApiClient";

export async function listarCitasPersistidas() {
  const citas = await solicitarMockApi("/citas");
  return Array.isArray(citas) ? citas : [];
}

export async function obtenerCitaPersistida(id) {
  return solicitarMockApi(`/citas/${encodeURIComponent(id)}`);
}

export function crearCitaPersistida(cita) {
  return solicitarMockApi("/citas", {
    method: "POST",
    body: JSON.stringify(cita),
  });
}

export async function actualizarCitaPersistida(id, cambios) {
  const cita = await obtenerCitaPersistida(id);

  if (!cita) {
    return null;
  }

  return solicitarMockApi(`/citas/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify({ ...cita, ...cambios, id: cita.id }),
  });
}

export function eliminarCitaPersistida(id) {
  return solicitarMockApi(`/citas/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}