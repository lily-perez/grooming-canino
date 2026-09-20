import { perrosService } from "@/services/perrosService";

export const perrosRepository = {
  async listar(filtros) {
    const respuesta = await perrosService.listar(filtros);
    return respuesta.data;
  },

  async obtener(id) {
    const respuesta = await perrosService.obtener(id);
    return respuesta.data;
  },

  async crear(datos) {
    const respuesta = await perrosService.crear(datos);
    return respuesta.data;
  },

  async actualizar(id, datos) {
    const respuesta = await perrosService.actualizar(id, datos);
    return respuesta.data;
  },

  async cambiarEstado(id, activo) {
    const respuesta = await perrosService.cambiarEstado(id, activo);
    return respuesta.data;
  },
};
