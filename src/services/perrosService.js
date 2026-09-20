import apiClient from "@/services/apiClient";

export const perrosService = {
  listar(filtros = {}) {
    const params = new URLSearchParams();

    for (const [campo, valor] of Object.entries(filtros)) {
      if (valor !== undefined && valor !== null && valor !== "") {
        params.set(campo, String(valor));
      }
    }

    const query = params.toString();
    return apiClient.get(query ? `/api/perros?${query}` : "/api/perros");
  },

  obtener(id) {
    return apiClient.get(`/api/perros/${id}`);
  },

  crear(datos) {
    return apiClient.post("/api/perros", datos);
  },

  actualizar(id, datos) {
    return apiClient.put(`/api/perros/${id}`, datos);
  },

  cambiarEstado(id, activo) {
    return apiClient.patch(`/api/perros/${id}/estado`, { activo });
  },
};
