import { requerirRol } from "@/server/autenticacion/autorizacion";
import {
  actualizarCitaPersistida,
  eliminarCitaPersistida,
  listarCitasPersistidas,
  obtenerCitaPersistida,
} from "@/server/persistencia/citasAdapter";
import {
  crearErrorServidor,
  leerJson,
  respuestaError,
} from "@/server/respuestas";
import {
  hayCruceHorario,
  tieneErroresCita,
  validarCita,
} from "@/utils/validacionesCitas";

export async function GET(request, { params }) {
  try {
    await requerirRol("administrador");

    const { id } = await params;
    const cita = await obtenerCitaPersistida(id);

    if (!cita) {
      throw crearErrorServidor(
        "CITA_NO_ENCONTRADA",
        "La cita solicitada no existe.",
        404,
      );
    }

    return Response.json({
      data: cita,
    });
  } catch (error) {
    return respuestaError(error);
  }
}

export async function PUT(request, { params }) {
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
    const { datos, erroresCampos } = validarCita(body);

    if (tieneErroresCita(erroresCampos)) {
      throw crearErrorServidor(
        "DATOS_INVALIDOS",
        "Revisa los datos ingresados.",
        400,
        erroresCampos,
      );
    }

    const citas = await listarCitasPersistidas();

    if (hayCruceHorario(citas, datos, id)) {
      throw crearErrorServidor(
        "HORARIO_NO_DISPONIBLE",
        "El groomer ya tiene una cita programada en ese horario.",
        409,
      );
    }

    const cita = await actualizarCitaPersistida(id, datos);

    return Response.json({
      data: cita,
      mensaje: "Cita actualizada correctamente.",
    });
  } catch (error) {
    return respuestaError(error);
  }
}

export async function DELETE(request, { params }) {
  try {
    await requerirRol("administrador");

    const { id } = await params;
    const cita = await obtenerCitaPersistida(id);

    if (!cita) {
      throw crearErrorServidor(
        "CITA_NO_ENCONTRADA",
        "La cita solicitada no existe.",
        404,
      );
    }

    await eliminarCitaPersistida(id);

    return Response.json({
      data: null,
      mensaje: "Cita eliminada correctamente.",
    });
  } catch (error) {
    return respuestaError(error);
  }
}