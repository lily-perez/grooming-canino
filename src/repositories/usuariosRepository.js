import { usuariosService } from "@/services/usuariosService";

export const usuariosRepository = {
  async listar() {
    const respuesta = await usuariosService.listar();
    return respuesta.data;
  },
  async obtener(id) {
    const respuesta = await usuariosService.obtener(id);
    return respuesta.data;
  },
  async actualizar(id, datos) {
    const respuesta = await usuariosService.actualizar(id, datos);
    return respuesta.data;
  },
  async cambiarEstado(id, activo) {
    const respuesta = await usuariosService.cambiarEstado(id, activo);
    return respuesta.data;
  },
};
