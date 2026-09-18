import { apiClient } from "./apiClient";
import { API_BASE } from "./api";

const URL = `${API_BASE}/Servicios`;

export function getServicios() {
  return apiClient.get(URL);
}

export function createServicio(data) {
  return apiClient.post(URL, data);
}

export function updateServicio(id, data) {
  return apiClient.put(`${URL}/${id}`, data);
}

export function deleteServicio(id) {
  return apiClient.delete(`${URL}/${id}`);
}