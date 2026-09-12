import { autenticacionService } from "@/services/autenticacionService";

export const autenticacionRepository = {
  async registrar(datos) {
    const respuesta = await autenticacionService.registrar(datos);
    return respuesta.data.usuario;
  },
  async login(credenciales) {
    const respuesta = await autenticacionService.login(credenciales);
    return respuesta.data.usuario;
  },
  cerrarSesion() {
    return autenticacionService.cerrarSesion();
  },
  async obtenerUsuarioActual() {
    const respuesta = await autenticacionService.obtenerUsuarioActual();
    return respuesta.data.usuario;
  },
};
