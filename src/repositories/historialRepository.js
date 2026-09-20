import { historialService } from "@/services/historialService";

export const historialRepository = {
  async listar(filtros) {
    const respuesta = await historialService.listar(filtros);
    return respuesta.data;
  },

  async obtener(id) {
    const respuesta = await historialService.obtener(id);
    return respuesta.data;
  },

  async actualizar(id, datos) {
    const respuesta = await historialService.actualizar(id, datos);
    return respuesta.data;
  },

  async listarPorPerro(perroId) {
    const respuesta = await historialService.listarPorPerro(perroId);
    return respuesta.data;
  },
};
