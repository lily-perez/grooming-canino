import apiClient from "@/services/apiClient";

export const clientesService = {
  listar(filtros = {}) {
    const params = new URLSearchParams();

    for (const [campo, valor] of Object.entries(filtros)) {
      if (valor !== undefined && valor !== null && valor !== "") {
        params.set(campo, String(valor));
      }
    }

    const query = params.toString();
    return apiClient.get(query ? `/api/clientes?${query}` : "/api/clientes");
  },

  obtener(id) {
    return apiClient.get(`/api/clientes/${id}`);
  },

  crear(datos) {
    return apiClient.post("/api/clientes", datos);
  },

  actualizar(id, datos) {
    return apiClient.put(`/api/clientes/${id}`, datos);
  },

  cambiarEstado(id, activo) {
    return apiClient.patch(`/api/clientes/${id}/estado`, { activo });
  },
};
