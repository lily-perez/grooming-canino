import { requerirRol } from "@/server/autenticacion/autorizacion";
import {
  actualizarUsuarioPersistido,
  obtenerUsuarioPersistido,
  sanitizarUsuario,
} from "@/server/persistencia/usuariosAdapter";
import {
  crearErrorServidor,
  leerJson,
  respuestaError,
} from "@/server/respuestas";

export async function PATCH(request, { params }) {
  try {
    await requerirRol("administrador");
    const { id } = await params;
    const usuarioActual = await obtenerUsuarioPersistido(id);

    if (!usuarioActual) {
      throw crearErrorServidor(
        "USUARIO_NO_ENCONTRADO",
        "El usuario solicitado no existe.",
        404,
      );
    }

    const body = await leerJson(request);

    if (typeof body.activo !== "boolean") {
      throw crearErrorServidor(
        "DATOS_INVALIDOS",
        "El estado indicado no es válido.",
        400,
        { activo: "El estado debe ser verdadero o falso." },
      );
    }

    const usuario = await actualizarUsuarioPersistido(id, {
      activo: body.activo,
    });

    return Response.json({
      data: sanitizarUsuario(usuario),
      mensaje: body.activo
        ? "Usuario activado correctamente."
        : "Usuario desactivado correctamente.",
    });
  } catch (error) {
    return respuestaError(error);
  }
}
