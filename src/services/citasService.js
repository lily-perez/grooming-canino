import apiClient from "@/services/apiClient";

export const citasService = {
  listar() {
    return apiClient.get("/api/citas");
  },

  obtener(id) {
    return apiClient.get(`/api/citas/${id}`);
  },

  crear(datos) {
    return apiClient.post("/api/citas", datos);
  },

  actualizar(id, datos) {
    return apiClient.put(`/api/citas/${id}`, datos);
  },

  eliminar(id) {
    return apiClient.delete(`/api/citas/${id}`);
  },
};