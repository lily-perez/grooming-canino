import { requerirRol } from "@/server/autenticacion/autorizacion";
import {
  crearCitaPersistida,
  listarCitasPersistidas,
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

export async function GET() {
  try {
    await requerirRol("administrador");

    const citas = await listarCitasPersistidas();

    return Response.json({
      data: citas,
    });
  } catch (error) {
    return respuestaError(error);
  }
}

export async function POST(request) {
  try {
    await requerirRol("administrador");

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

    if (hayCruceHorario(citas, datos)) {
      throw crearErrorServidor(
        "HORARIO_NO_DISPONIBLE",
        "El groomer ya tiene una cita programada en ese horario.",
        409,
      );
    }

    const cita = await crearCitaPersistida(datos);

    return Response.json(
      {
        data: cita,
        mensaje: "Cita creada correctamente.",
      },
      { status: 201 },
    );
  } catch (error) {
    return respuestaError(error);
  }
}