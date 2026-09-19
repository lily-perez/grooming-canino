import { groomersService } from "@/services/groomersService";

export const groomersRepository = {
  async listar(filtros) {
    const respuesta = await groomersService.listar(filtros);
    return respuesta.data;
  },

  async obtener(id) {
    const respuesta = await groomersService.obtener(id);
    return respuesta.data;
  },
};
