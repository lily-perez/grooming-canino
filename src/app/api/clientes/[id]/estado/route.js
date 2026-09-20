import { requerirRol } from "@/server/autenticacion/autorizacion";
import {
  cambiarEstadoClientePersistido,
  obtenerClientePersistido,
} from "@/server/persistencia/clientesAdapter";
import {
  crearErrorServidor,
  leerJson,
  respuestaError,
} from "@/server/respuestas";

export async function PATCH(request, { params }) {
  try {
    await requerirRol("administrador");
    const { id } = await params;

    if (!(await obtenerClientePersistido(id))) {
      throw crearErrorServidor(
        "CLIENTE_NO_ENCONTRADO",
        "El cliente solicitado no existe.",
        404,
      );
    }

    const body = await leerJson(request);

    if (typeof body.activo !== "boolean") {
      throw crearErrorServidor(
        "DATOS_INVALIDOS",
        "El estado indicado no es válido.",
        400,
        { activo: "El estado debe ser verdadero o falso." },
      );
    }

    const cliente = await cambiarEstadoClientePersistido(id, body.activo);

    return Response.json({
      data: cliente,
      mensaje: body.activo
        ? "Cliente activado correctamente."
        : "Cliente desactivado correctamente.",
    });
  } catch (error) {
    return respuestaError(error);
  }
}
