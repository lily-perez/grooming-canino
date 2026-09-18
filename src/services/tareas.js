import { apiClient } from "./apiClient";
import { API_BASE } from "./api";

const URL = `${API_BASE}/tareas`;

export function getTareas() {
  return apiClient.get(URL);
}

export function createTarea(data) {
  return apiClient.post(URL, data);
}

export function updateTarea(id, data) {
  return apiClient.put(`${URL}/${id}`, data);
}

export function deleteTarea(id) {
  return apiClient.delete(`${URL}/${id}`);
}