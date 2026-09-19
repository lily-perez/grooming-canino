import { requerirRol } from "@/server/autenticacion/autorizacion";
import {
  obtenerUsuarioPersistido,
  sanitizarUsuario,
} from "@/server/persistencia/usuariosAdapter";
import { crearErrorServidor, respuestaError } from "@/server/respuestas";

export async function GET(request, { params }) {
  try {
    await requerirRol("administrador");
    const { id } = await params;
    const usuario = await obtenerUsuarioPersistido(id);

    if (!usuario || usuario.rol !== "groomer") {
      throw crearErrorServidor(
        "RECURSO_NO_ENCONTRADO",
        "El Groomer solicitado no existe.",
        404,
      );
    }

    return Response.json({ data: sanitizarUsuario(usuario) });
  } catch (error) {
    return respuestaError(error);
  }
}
