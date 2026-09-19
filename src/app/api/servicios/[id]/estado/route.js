import { requerirRol } from "@/server/autenticacion/autorizacion";
import {
  cambiarEstadoServicioPersistido,
  obtenerServicioPersistido,
} from "@/server/persistencia/serviciosAdapter";
import {
  crearErrorServidor,
  leerJson,
  respuestaError,
} from "@/server/respuestas";

export async function PATCH(request, { params }) {
  try {
    await requerirRol("administrador");
    const { id } = await params;

    if (!(await obtenerServicioPersistido(id))) {
      throw crearErrorServidor(
        "SERVICIO_NO_ENCONTRADO",
        "El servicio solicitado no existe.",
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

    const servicio = await cambiarEstadoServicioPersistido(id, body.activo);

    return Response.json({
      data: servicio,
      mensaje: body.activo
        ? "Servicio activado correctamente."
        : "Servicio desactivado correctamente.",
    });
  } catch (error) {
    return respuestaError(error);
  }
}
