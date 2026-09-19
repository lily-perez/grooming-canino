import { requerirRol } from "@/server/autenticacion/autorizacion";
import {
  cambiarEstadoCitaPersistida,
  obtenerCitaPersistida,
} from "@/server/persistencia/citasAdapter";
import {
  crearErrorServidor,
  leerJson,
  respuestaError,
} from "@/server/respuestas";
import {
  ESTADOS_CITA,
  transicionCitaPermitida,
} from "@/utils/validacionesCitas";

export async function PATCH(request, { params }) {
  try {
    await requerirRol("administrador");
    const { id } = await params;
    const citaActual = await obtenerCitaPersistida(id);

    if (!citaActual) {
      throw crearErrorServidor(
        "CITA_NO_ENCONTRADA",
        "La cita solicitada no existe.",
        404,
      );
    }

    const body = await leerJson(request);
    const estado = String(body.estado ?? "").trim();

    if (!ESTADOS_CITA.includes(estado)) {
      throw crearErrorServidor(
        "DATOS_INVALIDOS",
        "El estado indicado no es válido.",
        400,
        { estado: "El estado de la cita no es válido." },
      );
    }

    if (!transicionCitaPermitida(citaActual.estado, estado)) {
      throw crearErrorServidor(
        "ESTADO_INVALIDO",
        "La transición de estado solicitada no está permitida.",
        409,
      );
    }

    const cita = await cambiarEstadoCitaPersistida(id, estado);

    return Response.json({
      data: cita,
      mensaje:
        estado === "cancelada"
          ? "Cita cancelada correctamente."
          : "Estado de la cita actualizado correctamente.",
    });
  } catch (error) {
    return respuestaError(error);
  }
}
