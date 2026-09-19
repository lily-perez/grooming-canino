import { requerirUsuarioAutenticado } from "@/server/autenticacion/autorizacion";
import { obtenerCitaPersistida } from "@/server/persistencia/citasAdapter";
import { listarTareasPersistidas } from "@/server/persistencia/tareasAdapter";
import { citaRelacionadaConGroomer } from "@/server/reglas/validarCita";
import { crearErrorServidor, respuestaError } from "@/server/respuestas";

export async function POST(request, { params }) {
  try {
    const usuario = await requerirUsuarioAutenticado();
    const { id } = await params;
    const cita = await obtenerCitaPersistida(id);

    if (!cita) {
      throw crearErrorServidor(
        "CITA_NO_ENCONTRADA",
        "La cita solicitada no existe.",
        404,
      );
    }

    const tareas = await listarTareasPersistidas();
    const relacionadas = tareas.filter(
      (tarea) => String(tarea.citaId) === String(cita.id),
    );

    if (usuario.rol === "groomer") {
      if (!citaRelacionadaConGroomer(cita, relacionadas, usuario.id)) {
        throw crearErrorServidor(
          "ACCESO_DENEGADO",
          "No tienes permiso para finalizar esta cita.",
          403,
        );
      }
    } else if (usuario.rol !== "administrador") {
      throw crearErrorServidor(
        "ACCESO_DENEGADO",
        "No tienes permiso para finalizar esta cita.",
        403,
      );
    }

    if (cita.estado !== "en_proceso") {
      throw crearErrorServidor(
        "ESTADO_INVALIDO",
        "Solo puede finalizarse una cita en proceso.",
        409,
      );
    }

    if (
      relacionadas.length === 0 ||
      relacionadas.some((tarea) => tarea.estado !== "completada")
    ) {
      throw crearErrorServidor(
        "ESTADO_INVALIDO",
        "La cita no puede finalizarse mientras existan tareas pendientes.",
        409,
      );
    }

    throw crearErrorServidor(
      "OPERACION_NO_DISPONIBLE",
      "La finalización coordinada requiere RegistroAtencion y queda pendiente para un incremento posterior.",
      409,
    );
  } catch (error) {
    return respuestaError(error);
  }
}
