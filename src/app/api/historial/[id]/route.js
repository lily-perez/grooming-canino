import {
  requerirRol,
  requerirUsuarioAutenticado,
} from "@/server/autenticacion/autorizacion";
import { obtenerCitaPersistida } from "@/server/persistencia/citasAdapter";
import {
  actualizarRegistroAtencionPersistido,
  obtenerRegistroAtencionPersistido,
} from "@/server/persistencia/historialAdapter";
import { listarTareasPersistidas } from "@/server/persistencia/tareasAdapter";
import { citaRelacionadaConGroomer } from "@/server/reglas/validarCita";
import {
  componerVistasHistorial,
  extraerObservaciones,
  tieneErroresObservacion,
} from "@/server/reglas/validarRegistroAtencion";
import {
  crearErrorServidor,
  leerJson,
  respuestaError,
} from "@/server/respuestas";

async function obtenerRegistroAutorizado(id, usuario) {
  const registro = await obtenerRegistroAtencionPersistido(id);

  if (!registro) {
    throw crearErrorServidor(
      "REGISTRO_NO_ENCONTRADO",
      "El registro de atención solicitado no existe.",
      404,
    );
  }

  if (usuario.rol === "administrador") {
    return registro;
  }

  if (usuario.rol === "groomer") {
    const [cita, tareas] = await Promise.all([
      obtenerCitaPersistida(registro.citaId),
      listarTareasPersistidas(),
    ]);

    if (!cita || !citaRelacionadaConGroomer(cita, tareas, usuario.id)) {
      throw crearErrorServidor(
        "ACCESO_DENEGADO",
        "No tienes permiso para consultar este registro de atención.",
        403,
      );
    }

    return registro;
  }

  throw crearErrorServidor(
    "ACCESO_DENEGADO",
    "No tienes permiso para consultar este registro de atención.",
    403,
  );
}

export async function GET(_request, { params }) {
  try {
    const usuario = await requerirUsuarioAutenticado();
    const { id } = await params;
    const registro = await obtenerRegistroAutorizado(id, usuario);
    const [vista] = await componerVistasHistorial([registro]);

    return Response.json({ data: vista });
  } catch (error) {
    return respuestaError(error);
  }
}

export async function PUT(request, { params }) {
  try {
    await requerirRol("administrador");
    const { id } = await params;
    const registroActual = await obtenerRegistroAtencionPersistido(id);

    if (!registroActual) {
      throw crearErrorServidor(
        "REGISTRO_NO_ENCONTRADO",
        "El registro de atención solicitado no existe.",
        404,
      );
    }

    const body = await leerJson(request);
    const { datos, erroresCampos } = extraerObservaciones(body);

    if (tieneErroresObservacion(erroresCampos)) {
      throw crearErrorServidor(
        "DATOS_INVALIDOS",
        "Revisa los datos ingresados.",
        400,
        erroresCampos,
      );
    }

    const actualizado = await actualizarRegistroAtencionPersistido(id, datos);
    const [vista] = await componerVistasHistorial([actualizado]);

    return Response.json({
      data: vista,
      mensaje: "Registro de atención actualizado correctamente.",
    });
  } catch (error) {
    return respuestaError(error);
  }
}
