import apiClient from "@/services/apiClient";

export const autenticacionService = {
  registrar(datos) {
    return apiClient.post("/api/autenticacion/registro", datos);
  },
  login(credenciales) {
    return apiClient.post("/api/autenticacion/login", credenciales);
  },
  cerrarSesion() {
    return apiClient.post("/api/autenticacion/cerrar-sesion");
  },
  obtenerUsuarioActual() {
    return apiClient.get("/api/autenticacion/usuario-actual");
  },
};
