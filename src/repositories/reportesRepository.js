import { reportesService } from "@/services/reportesService";

export const reportesRepository = {
  async obtenerResumen(periodo) {
    const respuesta = await reportesService.obtenerResumen(periodo);
    return respuesta.data;
  },
};
