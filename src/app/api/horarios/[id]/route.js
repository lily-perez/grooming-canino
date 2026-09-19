import { requerirRol } from "@/server/autenticacion/autorizacion";
import {
  actualizarHorarioPersistido,
  obtenerHorarioPersistido,
} from "@/server/persistencia/horariosAdapter";
import { obtenerUsuarioPersistido } from "@/server/persistencia/usuariosAdapter";
import {
  crearErrorServidor,
  leerJson,
  respuestaError,
} from "@/server/respuestas";
import {
  tieneErroresHorario,
  validarHorarioGroomer,
} from "@/utils/validacionesHorarios";

export async function PUT(request, { params }) {
  try {
    await requerirRol("administrador");
    const { id } = await params;
    const horarioActual = await obtenerHorarioPersistido(id);

    if (!horarioActual) {
      throw crearErrorServidor(
        "RECURSO_NO_ENCONTRADO",
        "El horario solicitado no existe.",
        404,
      );
    }

    const body = await leerJson(request);
    const { datos, erroresCampos } = validarHorarioGroomer({
      ...body,
      groomerId: horarioActual.groomerId,
    });

    if (tieneErroresHorario(erroresCampos)) {
      throw crearErrorServidor(
        "DATOS_INVALIDOS",
        "Revisa los datos del horario.",
        400,
        erroresCampos,
      );
    }

    const groomer = await obtenerUsuarioPersistido(datos.groomerId);

    if (!groomer || groomer.rol !== "groomer") {
      throw crearErrorServidor(
        "RELACION_INVALIDA",
        "El Groomer indicado no existe.",
        409,
      );
    }

    const horario = await actualizarHorarioPersistido(id, datos);

    return Response.json({
      data: horario,
      mensaje: "Horario actualizado correctamente.",
    });
  } catch (error) {
    return respuestaError(error);
  }
}
