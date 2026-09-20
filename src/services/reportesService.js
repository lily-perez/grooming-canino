import apiClient from "@/services/apiClient";

export const reportesService = {
  obtenerResumen(periodo = "semana") {
    const params = new URLSearchParams();

    if (periodo) {
      params.set("periodo", periodo);
    }

    return apiClient.get(`/api/reportes/resumen?${params.toString()}`);
  },
};
