import apiClient from "@/services/apiClient";

export const usuariosService = {
  listar() {
    return apiClient.get("/api/usuarios");
  },
  obtener(id) {
    return apiClient.get(`/api/usuarios/${id}`);
  },
  actualizar(id, datos) {
    return apiClient.put(`/api/usuarios/${id}`, datos);
  },
  cambiarEstado(id, activo) {
    return apiClient.patch(`/api/usuarios/${id}/estado`, { activo });
  },
};
