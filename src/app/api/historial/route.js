import { requerirRol } from "@/server/autenticacion/autorizacion";
import { listarRegistrosAtencionPersistidos } from "@/server/persistencia/historialAdapter";
import { componerVistasHistorial } from "@/server/reglas/validarRegistroAtencion";
import { respuestaError } from "@/server/respuestas";

export async function GET(request) {
  try {
    await requerirRol("administrador");
    const { searchParams } = new URL(request.url);
    const perroId = searchParams.get("perroId");
    const fecha = searchParams.get("fecha");
    let registros = await listarRegistrosAtencionPersistidos();

    if (perroId) {
      registros = registros.filter(
        (registro) => String(registro.perroId) === String(perroId),
      );
    }

    if (fecha) {
      registros = registros.filter((registro) => registro.fecha === fecha);
    }

    const historial = await componerVistasHistorial(registros);

    return Response.json({ data: historial });
  } catch (error) {
    return respuestaError(error);
  }
}
