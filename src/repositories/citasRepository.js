import { citasService } from "@/services/citasService";

export const citasRepository = {
  async listar() {
    const respuesta = await citasService.listar();
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

  async eliminar(id) {
    const respuesta = await citasService.eliminar(id);
    return respuesta.data;
  },
};