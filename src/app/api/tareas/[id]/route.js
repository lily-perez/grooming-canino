import {
  requerirRol,
  requerirUsuarioAutenticado,
} from "@/server/autenticacion/autorizacion";
import {
  actualizarTareaPersistida,
  obtenerTareaPersistida,
} from "@/server/persistencia/tareasAdapter";
import { validarRelacionesTarea } from "@/server/reglas/validarTarea";
import {
  crearErrorServidor,
  leerJson,
  respuestaError,
} from "@/server/respuestas";
import {
  tieneErrores,
  validarTarea,
} from "@/utils/validacionesServiciosTareas";

export async function GET(request, { params }) {
  try {
    const usuario = await requerirUsuarioAutenticado();
    const { id } = await params;
    const tarea = await obtenerTareaPersistida(id);

    if (
      !tarea ||
      (usuario.rol === "groomer" &&
        String(tarea.groomerId) !== String(usuario.id))
    ) {
      throw crearErrorServidor(
        "TAREA_NO_ENCONTRADA",
        "La tarea solicitada no existe.",
        404,
      );
    }

    return Response.json({ data: tarea });
  } catch (error) {
    return respuestaError(error);
  }
}

export async function PUT(request, { params }) {
  try {
    await requerirRol("administrador");
    const { id } = await params;
    const tareaActual = await obtenerTareaPersistida(id);

    if (!tareaActual) {
      throw crearErrorServidor(
        "TAREA_NO_ENCONTRADA",
        "La tarea solicitada no existe.",
        404,
      );
    }

    if (tareaActual.estado !== "pendiente") {
      throw crearErrorServidor(
        "ESTADO_INVALIDO",
        "Solo pueden editarse tareas pendientes.",
        409,
      );
    }

    const body = await leerJson(request);
    const { datos, erroresCampos } = validarTarea(body);

    if (tieneErrores(erroresCampos)) {
      throw crearErrorServidor(
        "DATOS_INVALIDOS",
        "Revisa los datos ingresados.",
        400,
        erroresCampos,
      );
    }

    await validarRelacionesTarea(datos, id);
    const tarea = await actualizarTareaPersistida(id, datos);

    return Response.json({
      data: tarea,
      mensaje: "Tarea actualizada correctamente.",
    });
  } catch (error) {
    return respuestaError(error);
  }
}
