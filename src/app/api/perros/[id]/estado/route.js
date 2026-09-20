import { requerirRol } from "@/server/autenticacion/autorizacion";
import {
  cambiarEstadoPerroPersistido,
  obtenerPerroPersistido,
} from "@/server/persistencia/perrosAdapter";
import {
  crearErrorServidor,
  leerJson,
  respuestaError,
} from "@/server/respuestas";

export async function PATCH(request, { params }) {
  try {
    await requerirRol("administrador");
    const { id } = await params;

    if (!(await obtenerPerroPersistido(id))) {
      throw crearErrorServidor(
        "PERRO_NO_ENCONTRADO",
        "El perro solicitado no existe.",
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

    const perro = await cambiarEstadoPerroPersistido(id, body.activo);

    return Response.json({
      data: perro,
      mensaje: body.activo
        ? "Perro activado correctamente."
        : "Perro desactivado correctamente.",
    });
  } catch (error) {
    return respuestaError(error);
  }
}
