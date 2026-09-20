import {
  requerirRol,
  requerirUsuarioAutenticado,
} from "@/server/autenticacion/autorizacion";
import {
  crearCitaPersistida,
  listarCitasPersistidas,
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

export async function GET(request) {
  try {
    const usuario = await requerirUsuarioAutenticado();
    const { searchParams } = new URL(request.url);
    const fecha = searchParams.get("fecha");
    const estado = searchParams.get("estado");
    const perroId = searchParams.get("perroId");
    let citas = await listarCitasPersistidas();

    if (usuario.rol === "groomer") {
      const tareas = await listarTareasPersistidas();
      citas = citas.filter((cita) =>
        citaRelacionadaConGroomer(cita, tareas, usuario.id),
      );
    } else if (usuario.rol !== "administrador") {
      throw crearErrorServidor(
        "ACCESO_DENEGADO",
        "No tienes permiso para consultar citas.",
        403,
      );
    }

    if (fecha) {
      citas = citas.filter((cita) => cita.fecha === fecha);
    }

    if (estado) {
      citas = citas.filter((cita) => cita.estado === estado);
    }

    if (perroId) {
      citas = citas.filter((cita) => String(cita.perroId) === String(perroId));
    }

    return Response.json({ data: citas });
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

    const citaCompleta = await completarDatosCita(datos);
    const cita = await crearCitaPersistida({
      ...citaCompleta,
      estado: "programada",
    });

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
