import { requerirUsuarioAutenticado } from "@/server/autenticacion/autorizacion";
import { listarRegistrosAtencionPersistidos } from "@/server/persistencia/historialAdapter";
import { obtenerPerroPersistido } from "@/server/persistencia/perrosAdapter";
import {
  cargarContextoGroomer,
  perroRelacionadoConGroomer,
} from "@/server/reglas/validarClientePerro";
import { componerVistasHistorial } from "@/server/reglas/validarRegistroAtencion";
import { crearErrorServidor, respuestaError } from "@/server/respuestas";

export async function GET(_request, { params }) {
  try {
    const usuario = await requerirUsuarioAutenticado();
    const { id } = await params;
    const perro = await obtenerPerroPersistido(id);

    if (!perro) {
      throw crearErrorServidor(
        "PERRO_NO_ENCONTRADO",
        "El perro solicitado no existe.",
        404,
      );
    }

    if (usuario.rol === "groomer") {
      const contexto = await cargarContextoGroomer();

      if (
        !perroRelacionadoConGroomer(
          perro,
          contexto.citas,
          contexto.tareas,
          usuario.id,
        )
      ) {
        throw crearErrorServidor(
          "ACCESO_DENEGADO",
          "No tienes permiso para consultar el historial de este perro.",
          403,
        );
      }
    } else if (usuario.rol !== "administrador") {
      throw crearErrorServidor(
        "ACCESO_DENEGADO",
        "No tienes permiso para consultar el historial de este perro.",
        403,
      );
    }

    const registros = (await listarRegistrosAtencionPersistidos()).filter(
      (registro) => String(registro.perroId) === String(perro.id),
    );
    const historial = await componerVistasHistorial(registros);

    return Response.json({ data: historial });
  } catch (error) {
    return respuestaError(error);
  }
}
