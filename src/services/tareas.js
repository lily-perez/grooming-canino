import { apiClient } from "./apiClient";

const URL = "/api/tareas";

export function getTareas() {
  return apiClient.get(URL);
}

export function getMisTareas() {
  return apiClient.get(`${URL}/mias`);
}

export function createTarea(data) {
  return apiClient.post(URL, data);
}

export function updateTarea(id, data) {
  return apiClient.put(`${URL}/${id}`, data);
}

export function cambiarEstadoTarea(id, estado) {
  return apiClient.patch(`${URL}/${id}/estado`, { estado });
}