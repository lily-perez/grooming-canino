import { requerirRol } from "@/server/autenticacion/autorizacion";
import {
  crearHorarioPersistido,
  listarHorariosDeGroomer,
} from "@/server/persistencia/horariosAdapter";
import { obtenerUsuarioPersistido } from "@/server/persistencia/usuariosAdapter";
import {
  crearErrorServidor,
  leerJson,
  respuestaError,
} from "@/server/respuestas";
import {
  tieneErroresHorario,
  validarHorarioGroomer,
} from "@/utils/validacionesHorarios";

async function obtenerGroomer(id) {
  const usuario = await obtenerUsuarioPersistido(id);

  if (!usuario || usuario.rol !== "groomer") {
    throw crearErrorServidor(
      "RECURSO_NO_ENCONTRADO",
      "El Groomer solicitado no existe.",
      404,
    );
  }

  return usuario;
}

export async function GET(request, { params }) {
  try {
    await requerirRol("administrador");
    const { id } = await params;
    await obtenerGroomer(id);
    const horarios = await listarHorariosDeGroomer(id);

    return Response.json({ data: horarios });
  } catch (error) {
    return respuestaError(error);
  }
}

export async function POST(request, { params }) {
  try {
    await requerirRol("administrador");
    const { id } = await params;
    await obtenerGroomer(id);
    const body = await leerJson(request);
    const { datos, erroresCampos } = validarHorarioGroomer({
      ...body,
      groomerId: id,
    });

    if (tieneErroresHorario(erroresCampos)) {
      throw crearErrorServidor(
        "DATOS_INVALIDOS",
        "Revisa los datos del horario.",
        400,
        erroresCampos,
      );
    }

    const horario = await crearHorarioPersistido({
      ...datos,
      activo: true,
    });

    return Response.json(
      {
        data: horario,
        mensaje: "Horario creado correctamente.",
      },
      { status: 201 },
    );
  } catch (error) {
    return respuestaError(error);
  }
}
