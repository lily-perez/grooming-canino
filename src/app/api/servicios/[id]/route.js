import {
  requerirRol,
  requerirUsuarioAutenticado,
} from "@/server/autenticacion/autorizacion";
import {
  actualizarServicioPersistido,
  obtenerServicioPersistido,
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

export async function GET(request, { params }) {
  try {
    const usuario = await requerirUsuarioAutenticado();
    const { id } = await params;
    const servicio = await obtenerServicioPersistido(id);
    let autorizado = Boolean(servicio);

    if (servicio && usuario.rol === "groomer") {
      const tareas = await listarTareasPersistidas();
      autorizado =
        servicio.activo &&
        tareas.some(
          (tarea) =>
            String(tarea.groomerId) === String(usuario.id) &&
            String(tarea.servicioId) === String(servicio.id),
        );
    }

    if (!autorizado) {
      throw crearErrorServidor(
        "SERVICIO_NO_ENCONTRADO",
        "El servicio solicitado no existe.",
        404,
      );
    }

    return Response.json({ data: servicio });
  } catch (error) {
    return respuestaError(error);
  }
}

export async function PUT(request, { params }) {
  try {
    await requerirRol("administrador");
    const { id } = await params;

    if (!(await obtenerServicioPersistido(id))) {
      throw crearErrorServidor(
        "SERVICIO_NO_ENCONTRADO",
        "El servicio solicitado no existe.",
        404,
      );
    }

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

    const servicio = await actualizarServicioPersistido(id, datos);

    return Response.json({
      data: servicio,
      mensaje: "Servicio actualizado correctamente.",
    });
  } catch (error) {
    return respuestaError(error);
  }
}
