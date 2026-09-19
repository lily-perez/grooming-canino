import { apiClient } from "./apiClient";

const URL = "/api/servicios";

export function getServicios() {
  return apiClient.get(URL);
}

export function createServicio(data) {
  return apiClient.post(URL, data);
}

export function updateServicio(id, data) {
  return apiClient.put(`${URL}/${id}`, data);
}

export function cambiarEstadoServicio(id, activo) {
  return apiClient.patch(`${URL}/${id}/estado`, { activo });
}