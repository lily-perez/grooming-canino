import {
  cambiarEstadoTarea,
  createTarea,
  getMisTareas,
  getTareas,
  updateTarea,
} from "@/services/tareas";

export const tareasRepository = {
  async listar() {
    const respuesta = await getTareas();
    return respuesta.data;
  },

  async listarMias() {
    const respuesta = await getMisTareas();
    return respuesta.data;
  },

  async crear(datos) {
    const respuesta = await createTarea(datos);
    return respuesta.data;
  },

  async actualizar(id, datos) {
    const respuesta = await updateTarea(id, datos);
    return respuesta.data;
  },

  async cambiarEstado(id, estado) {
    const respuesta = await cambiarEstadoTarea(id, estado);
    return respuesta.data;
  },
};
