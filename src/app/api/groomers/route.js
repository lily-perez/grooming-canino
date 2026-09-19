import { requerirRol } from "@/server/autenticacion/autorizacion";
import {
  listarUsuariosPersistidos,
  sanitizarUsuario,
} from "@/server/persistencia/usuariosAdapter";
import { respuestaError } from "@/server/respuestas";

export async function GET(request) {
  try {
    await requerirRol("administrador");
    const { searchParams } = new URL(request.url);
    const filtroActivo = searchParams.get("activo");
    let groomers = (await listarUsuariosPersistidos()).filter(
      (usuario) => usuario.rol === "groomer",
    );

    if (filtroActivo === "true") {
      groomers = groomers.filter((groomer) => groomer.activo);
    } else if (filtroActivo === "false") {
      groomers = groomers.filter((groomer) => !groomer.activo);
    }

    return Response.json({
      data: groomers.map(sanitizarUsuario),
    });
  } catch (error) {
    return respuestaError(error);
  }
}
