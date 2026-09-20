import { requerirUsuarioAutenticado } from "@/server/autenticacion/autorizacion";
import {
  cambiarEstadoCitaPersistida,
  obtenerCitaPersistida,
} from "@/server/persistencia/citasAdapter";
import {
  crearRegistroAtencionPersistido,
  eliminarRegistroAtencionPersistido,
} from "@/server/persistencia/historialAdapter";
import { listarTareasPersistidas } from "@/server/persistencia/tareasAdapter";
import { citaRelacionadaConGroomer } from "@/server/reglas/validarCita";
import {
  asegurarRegistroUnicoPorCita,
  componerVistasHistorial,
  extraerObservaciones,
  fechaRegistroServidor,
  tieneErroresObservacion,
} from "@/server/reglas/validarRegistroAtencion";
import {
  crearErrorServidor,
  respuestaError,
} from "@/server/respuestas";

async function leerCuerpoOpcional(request) {
  try {
    const body = await request.json();
    return body && typeof body === "object" ? body : {};
  } catch {
    return {};
  }
}

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

    await asegurarRegistroUnicoPorCita(cita.id);

    const body = await leerCuerpoOpcional(request);
    const { datos, erroresCampos } = extraerObservaciones(body);

    if (tieneErroresObservacion(erroresCampos)) {
      throw crearErrorServidor(
        "DATOS_INVALIDOS",
        "Revisa los datos ingresados.",
        400,
        erroresCampos,
      );
    }

    const registroCreado = await crearRegistroAtencionPersistido({
      citaId: cita.id,
      perroId: cita.perroId,
      registradoPorUsuarioId: usuario.id,
      ...datos,
      fecha: fechaRegistroServidor(),
    });

    let citaActualizada;

    try {
      citaActualizada = await cambiarEstadoCitaPersistida(
        cita.id,
        "completada",
      );

      if (!citaActualizada) {
        throw new Error("La cita no pudo actualizarse.");
      }
    } catch {
      try {
        await eliminarRegistroAtencionPersistido(registroCreado.id);
      } catch {
        // La compensación es de mejor esfuerzo.
      }

      throw crearErrorServidor(
        "ERROR_PERSISTENCIA",
        "No fue posible completar la finalización de la cita.",
        500,
      );
    }

    const [registroAtencion] = await componerVistasHistorial([registroCreado]);

    return Response.json({
      data: {
        cita: citaActualizada,
        registroAtencion,
      },
      mensaje: "Cita finalizada correctamente.",
    });
  } catch (error) {
    return respuestaError(error);
  }
}
