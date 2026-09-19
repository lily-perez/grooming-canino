import apiClient from "@/services/apiClient";

export const citasService = {
  listar(filtros = {}) {
    const params = new URLSearchParams();

    for (const [campo, valor] of Object.entries(filtros)) {
      if (valor) {
        params.set(campo, valor);
      }
    }

    const query = params.toString();
    return apiClient.get(query ? `/api/citas?${query}` : "/api/citas");
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

  cambiarEstado(id, estado) {
    return apiClient.patch(`/api/citas/${id}/estado`, { estado });
  },
};
