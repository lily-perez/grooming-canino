import {
  cambiarEstadoServicio,
  createServicio,
  getServicios,
  updateServicio,
} from "@/services/servicios";

export const serviciosRepository = {
  async listar() {
    const respuesta = await getServicios();
    return respuesta.data;
  },

  async crear(datos) {
    const respuesta = await createServicio(datos);
    return respuesta.data;
  },

  async actualizar(id, datos) {
    const respuesta = await updateServicio(id, datos);
    return respuesta.data;
  },

  async cambiarEstado(id, activo) {
    const respuesta = await cambiarEstadoServicio(id, activo);
    return respuesta.data;
  },
};
