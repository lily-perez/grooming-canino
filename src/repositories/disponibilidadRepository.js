import { disponibilidadService } from "@/services/disponibilidadService";

export const disponibilidadRepository = {
  async listarGroomers(filtros) {
    const respuesta = await disponibilidadService.listarGroomers(filtros);
    return respuesta.data;
  },
};
