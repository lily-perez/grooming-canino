import { requerirUsuarioAutenticado } from "@/server/autenticacion/autorizacion";
import {
  actualizarCitaPersistida,
  obtenerCitaPersistida,
} from "@/server/persistencia/citasAdapter";
import {
  cambiarEstadoTareaPersistida,
  obtenerTareaPersistida,
} from "@/server/persistencia/tareasAdapter";
import {
  crearErrorServidor,
  leerJson,
  respuestaError,
} from "@/server/respuestas";
import {
  ESTADOS_TAREA,
  validarTransicionTarea,
} from "@/utils/validacionesServiciosTareas";

export async function PATCH(request, { params }) {
  try {
    const usuario = await requerirUsuarioAutenticado();
    const { id } = await params;
    const tareaActual = await obtenerTareaPersistida(id);

    if (
      !tareaActual ||
      (usuario.rol === "groomer" &&
        String(tareaActual.groomerId) !== String(usuario.id))
    ) {
      throw crearErrorServidor(
        "TAREA_NO_ENCONTRADA",
        "La tarea solicitada no existe.",
        404,
      );
    }

    const body = await leerJson(request);
    const estado = String(body.estado ?? "").trim();

    if (
      !ESTADOS_TAREA.includes(estado) ||
      !validarTransicionTarea(tareaActual.estado, estado)
    ) {
      throw crearErrorServidor(
        "ESTADO_INVALIDO",
        "La transición de estado solicitada no está permitida.",
        409,
      );
    }

    const cita = await obtenerCitaPersistida(tareaActual.citaId);

    if (!cita) {
      throw crearErrorServidor(
        "CITA_NO_ENCONTRADA",
        "La cita relacionada no existe.",
        404,
      );
    }

    if (cita.estado === "cancelada") {
      throw crearErrorServidor(
        "ESTADO_INVALIDO",
        "No se puede iniciar una tarea de una cita cancelada.",
        409,
      );
    }

    const debeIniciarCita =
      estado === "en_proceso" && cita.estado === "programada";

    if (debeIniciarCita) {
      await actualizarCitaPersistida(cita.id, {
        ...cita,
        estado: "en_proceso",
      });
    }

    let tarea;

    try {
      tarea = await cambiarEstadoTareaPersistida(id, estado);
    } catch (error) {
      if (debeIniciarCita) {
        try {
          await actualizarCitaPersistida(cita.id, {
            ...cita,
            estado: "programada",
          });
        } catch {
          // Compensación de mejor esfuerzo para la persistencia mock.
        }
      }

      throw error;
    }

    return Response.json({
      data: tarea,
      mensaje: "Estado de la tarea actualizado correctamente.",
    });
  } catch (error) {
    return respuestaError(error);
  }
}
