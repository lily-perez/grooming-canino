import { requerirRol } from "@/server/autenticacion/autorizacion";
import { listarGroomersDisponibles } from "@/server/reglas/disponibilidad";
import { crearErrorServidor, respuestaError } from "@/server/respuestas";
import { esFechaValida, esHoraValida } from "@/utils/tiempo";

export async function GET(request) {
  try {
    await requerirRol("administrador");
    const { searchParams } = new URL(request.url);
    const fecha = String(searchParams.get("fecha") ?? "").trim();
    const horaInicio = String(searchParams.get("horaInicio") ?? "").trim();
    const horaFin = String(searchParams.get("horaFin") ?? "").trim();
    const excluirTareaId = searchParams.get("excluirTareaId");
    const erroresCampos = {};

    if (!esFechaValida(fecha)) {
      erroresCampos.fecha = "La fecha es obligatoria y debe ser válida.";
    }

    if (!esHoraValida(horaInicio)) {
      erroresCampos.horaInicio = "Ingresa una hora de inicio válida.";
    }

    if (!esHoraValida(horaFin)) {
      erroresCampos.horaFin = "Ingresa una hora de finalización válida.";
    }

    if (
      esHoraValida(horaInicio) &&
      esHoraValida(horaFin) &&
      horaFin <= horaInicio
    ) {
      erroresCampos.horaFin =
        "La hora de finalización debe ser posterior a la hora de inicio.";
    }

    if (Object.keys(erroresCampos).length > 0) {
      throw crearErrorServidor(
        "DATOS_INVALIDOS",
        "Revisa los parámetros de disponibilidad.",
        400,
        erroresCampos,
      );
    }

    const groomers = await listarGroomersDisponibles({
      fecha,
      horaInicio,
      horaFin,
      excluirTareaId,
    });

    return Response.json({ data: groomers });
  } catch (error) {
    return respuestaError(error);
  }
}
