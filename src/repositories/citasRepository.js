import { citasService } from "@/services/citasService";

export const citasRepository = {
  async listar(filtros) {
    const respuesta = await citasService.listar(filtros);
    return respuesta.data;
  },

  async obtener(id) {
    const respuesta = await citasService.obtener(id);
    return respuesta.data;
  },

  async crear(datos) {
    const respuesta = await citasService.crear(datos);
    return respuesta.data;
  },

  async actualizar(id, datos) {
    const respuesta = await citasService.actualizar(id, datos);
    return respuesta.data;
  },

  async cambiarEstado(id, estado) {
    const respuesta = await citasService.cambiarEstado(id, estado);
    return respuesta.data;
  },

  async finalizar(id, datos) {
    const respuesta = await citasService.finalizar(id, datos);
    return respuesta.data;
  },
};
