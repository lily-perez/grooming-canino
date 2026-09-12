import { obtenerUsuarioAutenticado } from "@/server/autenticacion/autorizacion";
import { eliminarSesion } from "@/server/autenticacion/sesion";
import { crearErrorServidor, respuestaError } from "@/server/respuestas";

export async function GET() {
  try {
    const usuario = await obtenerUsuarioAutenticado();

    if (!usuario) {
      await eliminarSesion();
      throw crearErrorServidor(
        "NO_AUTENTICADO",
        "No existe una sesión válida.",
        401,
      );
    }

    return Response.json({ data: { usuario } });
  } catch (error) {
    return respuestaError(error);
  }
}
