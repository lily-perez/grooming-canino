import { requerirRol } from "@/server/autenticacion/autorizacion";
import { calcularResumenDashboard } from "@/server/reglas/dashboard";
import { respuestaError } from "@/server/respuestas";

export async function GET(request) {
  try {
    await requerirRol("administrador");
    const { searchParams } = new URL(request.url);
    const data = await calcularResumenDashboard(searchParams.get("periodo"));

    return Response.json({ data });
  } catch (error) {
    return respuestaError(error);
  }
}
