import { requerirRol } from "@/server/autenticacion/autorizacion";
import { listarCitasPersistidas } from "@/server/persistencia/citasAdapter";
import { listarTareasPersistidas } from "@/server/persistencia/tareasAdapter";
import { respuestaError } from "@/server/respuestas";

export async function GET(request) {
  try {
    const usuario = await requerirRol("groomer");
    const { searchParams } = new URL(request.url);
    const estado = searchParams.get("estado");
    const fecha = searchParams.get("fecha");
    const [tareas, citas] = await Promise.all([
      listarTareasPersistidas(),
      listarCitasPersistidas(),
    ]);
    const citasPorId = new Map(
      citas.map((cita) => [String(cita.id), cita]),
    );

    const propias = tareas.filter((tarea) => {
      if (String(tarea.groomerId) !== String(usuario.id)) {
        return false;
      }

      if (estado && tarea.estado !== estado) {
        return false;
      }

      if (fecha) {
        const cita = citasPorId.get(String(tarea.citaId));
        return cita?.fecha === fecha;
      }

      return true;
    });

    return Response.json({ data: propias });
  } catch (error) {
    return respuestaError(error);
  }
}
