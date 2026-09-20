import { dashboardService } from "@/services/dashboardService";

export const dashboardRepository = {
  async obtenerResumen(periodo) {
    const respuesta = await dashboardService.obtenerResumen(periodo);
    return respuesta.data;
  },
};
