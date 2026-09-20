import { requerirRol } from "@/server/autenticacion/autorizacion";
import {
  cambiarEstadoHorarioPersistido,
  obtenerHorarioPersistido,
} from "@/server/persistencia/horariosAdapter";
import {
  crearErrorServidor,
  leerJson,
  respuestaError,
} from "@/server/respuestas";

export async function PATCH(request, { params }) {
  try {
    await requerirRol("administrador");
    const { id } = await params;

    if (!(await obtenerHorarioPersistido(id))) {
      throw crearErrorServidor(
        "RECURSO_NO_ENCONTRADO",
        "El horario solicitado no existe.",
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

    const horario = await cambiarEstadoHorarioPersistido(id, body.activo);

    return Response.json({
      data: horario,
      mensaje: body.activo
        ? "Horario activado correctamente."
        : "Horario desactivado correctamente.",
    });
  } catch (error) {
    return respuestaError(error);
  }
}
