import { horariosService } from "@/services/horariosService";

export const horariosRepository = {
  async listarPorGroomer(groomerId) {
    const respuesta = await horariosService.listarPorGroomer(groomerId);
    return respuesta.data;
  },

  async crear(groomerId, datos) {
    const respuesta = await horariosService.crear(groomerId, datos);
    return respuesta.data;
  },

  async actualizar(id, datos) {
    const respuesta = await horariosService.actualizar(id, datos);
    return respuesta.data;
  },

  async cambiarEstado(id, activo) {
    const respuesta = await horariosService.cambiarEstado(id, activo);
    return respuesta.data;
  },
};
