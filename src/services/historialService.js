import apiClient from "@/services/apiClient";

export const historialService = {
  listar(filtros = {}) {
    const params = new URLSearchParams();

    for (const [campo, valor] of Object.entries(filtros)) {
      if (valor !== undefined && valor !== null && valor !== "") {
        params.set(campo, String(valor));
      }
    }

    const query = params.toString();
    return apiClient.get(query ? `/api/historial?${query}` : "/api/historial");
  },

  obtener(id) {
    return apiClient.get(`/api/historial/${id}`);
  },

  actualizar(id, datos) {
    return apiClient.put(`/api/historial/${id}`, datos);
  },

  listarPorPerro(perroId) {
    return apiClient.get(`/api/perros/${perroId}/historial`);
  },
};
