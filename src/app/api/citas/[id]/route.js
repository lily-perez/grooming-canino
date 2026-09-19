import {
  requerirRol,
  requerirUsuarioAutenticado,
} from "@/server/autenticacion/autorizacion";
import {
  actualizarCitaPersistida,
  obtenerCitaPersistida,
} from "@/server/persistencia/citasAdapter";
import { listarTareasPersistidas } from "@/server/persistencia/tareasAdapter";
import {
  citaRelacionadaConGroomer,
  completarDatosCita,
} from "@/server/reglas/validarCita";
import {
  crearErrorServidor,
  leerJson,
  respuestaError,
} from "@/server/respuestas";
import { tieneErroresCita, validarCita } from "@/utils/validacionesCitas";

async function obtenerCitaAutorizada(id, usuario) {
  const cita = await obtenerCitaPersistida(id);

  if (!cita) {
    throw crearErrorServidor(
      "CITA_NO_ENCONTRADA",
      "La cita solicitada no existe.",
      404,
    );
  }

  if (usuario.rol === "administrador") {
    return cita;
  }

  if (usuario.rol === "groomer") {
    const tareas = await listarTareasPersistidas();

    if (!citaRelacionadaConGroomer(cita, tareas, usuario.id)) {
      throw crearErrorServidor(
        "CITA_NO_ENCONTRADA",
        "La cita solicitada no existe.",
        404,
      );
    }

    return cita;
  }

  throw crearErrorServidor(
    "ACCESO_DENEGADO",
    "No tienes permiso para consultar esta cita.",
    403,
  );
}

export async function GET(request, { params }) {
  try {
    const usuario = await requerirUsuarioAutenticado();
    const { id } = await params;
    const cita = await obtenerCitaAutorizada(id, usuario);

    return Response.json({ data: cita });
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

    if (citaActual.estado !== "programada") {
      throw crearErrorServidor(
        "ESTADO_INVALIDO",
        "Solo pueden editarse citas programadas.",
        409,
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

    const citaCompleta = await completarDatosCita(datos);
    const cita = await actualizarCitaPersistida(id, citaCompleta);

    return Response.json({
      data: cita,
      mensaje: "Cita actualizada correctamente.",
    });
  } catch (error) {
    return respuestaError(error);
  }
}
