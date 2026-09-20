import { clientesService } from "@/services/clientesService";

export const clientesRepository = {
  async listar(filtros) {
    const respuesta = await clientesService.listar(filtros);
    return respuesta.data;
  },

  async obtener(id) {
    const respuesta = await clientesService.obtener(id);
    return respuesta.data;
  },

  async crear(datos) {
    const respuesta = await clientesService.crear(datos);
    return respuesta.data;
  },

  async actualizar(id, datos) {
    const respuesta = await clientesService.actualizar(id, datos);
    return respuesta.data;
  },

  async cambiarEstado(id, activo) {
    const respuesta = await clientesService.cambiarEstado(id, activo);
    return respuesta.data;
  },
};
