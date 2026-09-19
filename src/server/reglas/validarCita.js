import { listarServiciosPersistidos } from "@/server/persistencia/serviciosAdapter";
import { crearErrorServidor } from "@/server/respuestas";
import { calcularHoraFinEstimada } from "@/utils/validacionesCitas";

export async function resolverServiciosDeCita(servicioIds) {
  const catalogo = await listarServiciosPersistidos();
  const porId = new Map(
    catalogo.map((servicio) => [String(servicio.id), servicio]),
  );
  const servicios = [];

  for (const servicioId of servicioIds) {
    const servicio = porId.get(String(servicioId));

    if (!servicio) {
      throw crearErrorServidor(
        "SERVICIO_NO_ENCONTRADO",
        "Uno de los servicios indicados no existe.",
        404,
        { servicioIds: "Hay un servicio inexistente en la selección." },
      );
    }

    if (!servicio.activo) {
      throw crearErrorServidor(
        "RELACION_INVALIDA",
        "Solo pueden usarse servicios activos en una cita nueva o reprogramada.",
        409,
        { servicioIds: `El servicio ${servicio.nombre} se encuentra inactivo.` },
      );
    }

    servicios.push(servicio);
  }

  return servicios;
}

export async function completarDatosCita(datos) {
  const servicios = await resolverServiciosDeCita(datos.servicioIds);
  const horaFinEstimada = calcularHoraFinEstimada(
    datos.horaInicio,
    servicios,
  );

  if (!horaFinEstimada || horaFinEstimada <= datos.horaInicio) {
    throw crearErrorServidor(
      "DATOS_INVALIDOS",
      "No fue posible calcular una hora de finalización válida.",
      400,
      {
        horaFinEstimada:
          "La duración de los servicios no produce un horario válido.",
      },
    );
  }

  return {
    ...datos,
    horaFinEstimada,
  };
}

export function citaRelacionadaConGroomer(cita, tareas, groomerId) {
  return tareas.some(
    (tarea) =>
      String(tarea.citaId) === String(cita.id) &&
      String(tarea.groomerId) === String(groomerId),
  );
}
