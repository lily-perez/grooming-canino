import { requerirRol } from "@/server/autenticacion/autorizacion";
import { calcularResumenReportes } from "@/server/reglas/reportes";
import { respuestaError } from "@/server/respuestas";

export async function GET(request) {
  try {
    await requerirRol("administrador");
    const { searchParams } = new URL(request.url);
    const data = await calcularResumenReportes(searchParams.get("periodo"));

    return Response.json({ data });
  } catch (error) {
    return respuestaError(error);
  }
}
