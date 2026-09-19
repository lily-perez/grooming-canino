import { requerirRol } from "@/server/autenticacion/autorizacion";
import { listarCitasPersistidas } from "@/server/persistencia/citasAdapter";
import {
  crearTareaPersistida,
  listarTareasPersistidas,
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

export async function GET(request) {
  try {
    await requerirRol("administrador");
    const { searchParams } = new URL(request.url);
    const filtros = {
      citaId: searchParams.get("citaId"),
      groomerId: searchParams.get("groomerId"),
      estado: searchParams.get("estado"),
    };
    const fecha = searchParams.get("fecha");
    let tareas = await listarTareasPersistidas();

    for (const [campo, valor] of Object.entries(filtros)) {
      if (valor) {
        tareas = tareas.filter(
          (tarea) => String(tarea[campo]) === String(valor),
        );
      }
    }

    if (fecha) {
      const citas = await listarCitasPersistidas();
      const citasDeFecha = new Set(
        citas
          .filter((cita) => cita.fecha === fecha)
          .map((cita) => String(cita.id)),
      );
      tareas = tareas.filter((tarea) =>
        citasDeFecha.has(String(tarea.citaId)),
      );
    }

    return Response.json({ data: tareas });
  } catch (error) {
    return respuestaError(error);
  }
}

export async function POST(request) {
  try {
    await requerirRol("administrador");
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

    await validarRelacionesTarea(datos);
    const tarea = await crearTareaPersistida({
      ...datos,
      estado: "pendiente",
    });

    return Response.json(
      {
        data: tarea,
        mensaje: "Tarea creada correctamente.",
      },
      { status: 201 },
    );
  } catch (error) {
    return respuestaError(error);
  }
}
