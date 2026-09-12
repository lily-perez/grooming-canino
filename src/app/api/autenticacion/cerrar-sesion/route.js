import { eliminarSesion } from "@/server/autenticacion/sesion";
import { respuestaError } from "@/server/respuestas";

export async function POST() {
  try {
    await eliminarSesion();
    return new Response(null, { status: 204 });
  } catch (error) {
    return respuestaError(error);
  }
}
