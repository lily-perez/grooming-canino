import {
  requerirRol,
  requerirUsuarioAutenticado,
} from "@/server/autenticacion/autorizacion";
import {
  crearServicioPersistido,
  listarServiciosPersistidos,
} from "@/server/persistencia/serviciosAdapter";
import { listarTareasPersistidas } from "@/server/persistencia/tareasAdapter";
import {
  crearErrorServidor,
  leerJson,
  respuestaError,
} from "@/server/respuestas";
import {
  tieneErrores,
  validarServicio,
} from "@/utils/validacionesServiciosTareas";

export async function GET(request) {
  try {
    const usuario = await requerirUsuarioAutenticado();
    const { searchParams } = new URL(request.url);
    const filtroActivo = searchParams.get("activo");
    let servicios = await listarServiciosPersistidos();

    if (usuario.rol === "groomer") {
      const tareas = await listarTareasPersistidas();
      const serviciosAutorizados = new Set(
        tareas
          .filter(
            (tarea) => String(tarea.groomerId) === String(usuario.id),
          )
          .map((tarea) => String(tarea.servicioId)),
      );
      servicios = servicios.filter(
        (servicio) =>
          servicio.activo && serviciosAutorizados.has(String(servicio.id)),
      );
    } else if (filtroActivo === "true") {
      servicios = servicios.filter((servicio) => servicio.activo);
    } else if (filtroActivo === "false") {
      servicios = servicios.filter((servicio) => !servicio.activo);
    }

    return Response.json({ data: servicios });
  } catch (error) {
    return respuestaError(error);
  }
}

export async function POST(request) {
  try {
    await requerirRol("administrador");
    const body = await leerJson(request);
    const { datos, erroresCampos } = validarServicio(body);

    if (tieneErrores(erroresCampos)) {
      throw crearErrorServidor(
        "DATOS_INVALIDOS",
        "Revisa los datos ingresados.",
        400,
        erroresCampos,
      );
    }

    const servicio = await crearServicioPersistido({
      ...datos,
      activo: true,
    });

    return Response.json(
      {
        data: servicio,
        mensaje: "Servicio creado correctamente.",
      },
      { status: 201 },
    );
  } catch (error) {
    return respuestaError(error);
  }
}
