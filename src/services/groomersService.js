import apiClient from "@/services/apiClient";

export const groomersService = {
  listar(filtros = {}) {
    const params = new URLSearchParams();

    if (filtros.activo !== undefined && filtros.activo !== "") {
      params.set("activo", String(filtros.activo));
    }

    const query = params.toString();
    return apiClient.get(query ? `/api/groomers?${query}` : "/api/groomers");
  },

  obtener(id) {
    return apiClient.get(`/api/groomers/${id}`);
  },
};
