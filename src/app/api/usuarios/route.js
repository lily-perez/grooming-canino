import { requerirRol } from "@/server/autenticacion/autorizacion";
import {
  listarUsuariosPersistidos,
  sanitizarUsuario,
} from "@/server/persistencia/usuariosAdapter";
import { respuestaError } from "@/server/respuestas";

export async function GET() {
  try {
    await requerirRol("administrador");
    const usuarios = await listarUsuariosPersistidos();

    return Response.json({
      data: usuarios.map(sanitizarUsuario),
    });
  } catch (error) {
    return respuestaError(error);
  }
}
