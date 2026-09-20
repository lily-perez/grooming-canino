import apiClient from "@/services/apiClient";

export const horariosService = {
  listarPorGroomer(groomerId) {
    return apiClient.get(`/api/groomers/${groomerId}/horarios`);
  },

  crear(groomerId, datos) {
    return apiClient.post(`/api/groomers/${groomerId}/horarios`, datos);
  },

  actualizar(id, datos) {
    return apiClient.put(`/api/horarios/${id}`, datos);
  },

  cambiarEstado(id, activo) {
    return apiClient.patch(`/api/horarios/${id}/estado`, { activo });
  },
};
