import { obtenerPayloadSesion } from "@/server/autenticacion/sesion";
import {
  obtenerUsuarioPersistido,
  sanitizarUsuario,
} from "@/server/persistencia/usuariosAdapter";
import { crearErrorServidor } from "@/server/respuestas";
import { ROLES_PERMITIDOS } from "@/utils/validacionesAutenticacion";

export async function obtenerUsuarioAutenticado() {
  const payload = await obtenerPayloadSesion();

  if (!payload) {
    return null;
  }

  const usuario = await obtenerUsuarioPersistido(payload.usuarioId);

  if (
    !usuario ||
    usuario.activo !== true ||
    !ROLES_PERMITIDOS.includes(usuario.rol)
  ) {
    return null;
  }

  return sanitizarUsuario(usuario);
}

export async function requerirUsuarioAutenticado() {
  const usuario = await obtenerUsuarioAutenticado();

  if (!usuario) {
    throw crearErrorServidor(
      "NO_AUTENTICADO",
      "Debes iniciar sesión para continuar.",
      401,
    );
  }

  return usuario;
}

export async function requerirRol(rol) {
  const usuario = await requerirUsuarioAutenticado();

  if (usuario.rol !== rol) {
    throw crearErrorServidor(
      "ACCESO_DENEGADO",
      "No tienes permiso para realizar esta acción.",
      403,
    );
  }

  return usuario;
}
