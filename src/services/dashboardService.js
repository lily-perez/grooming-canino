import apiClient from "@/services/apiClient";

export const dashboardService = {
  obtenerResumen(periodo = "mes") {
    const params = new URLSearchParams();

    if (periodo) {
      params.set("periodo", periodo);
    }

    return apiClient.get(`/api/dashboard/resumen?${params.toString()}`);
  },
};
