import {
  listarCitasPersistidas,
  obtenerCitaPersistida,
} from "@/server/persistencia/citasAdapter";
import { obtenerServicioPersistido } from "@/server/persistencia/serviciosAdapter";
import { listarTareasPersistidas } from "@/server/persistencia/tareasAdapter";
import { obtenerUsuarioPersistido } from "@/server/persistencia/usuariosAdapter";
import { crearErrorServidor } from "@/server/respuestas";
import { haySolapamientoTarea } from "@/utils/validacionesServiciosTareas";

export async function validarRelacionesTarea(datos, idExcluir = null) {
  const [cita, servicio, groomer] = await Promise.all([
    obtenerCitaPersistida(datos.citaId),
    obtenerServicioPersistido(datos.servicioId),
    obtenerUsuarioPersistido(datos.groomerId),
  ]);

  if (!cita) {
    throw crearErrorServidor(
      "CITA_NO_ENCONTRADA",
      "La cita indicada no existe.",
      404,
    );
  }

  if (!servicio) {
    throw crearErrorServidor(
      "SERVICIO_NO_ENCONTRADO",
      "El servicio indicado no existe.",
      404,
    );
  }

  if (!servicio.activo) {
    throw crearErrorServidor(
      "RELACION_INVALIDA",
      "El servicio indicado se encuentra inactivo.",
      409,
    );
  }

  const serviciosCita = Array.isArray(cita.servicioIds)
    ? cita.servicioIds
    : [cita.servicioId].filter(Boolean);

  if (
    !serviciosCita.some(
      (servicioId) => String(servicioId) === String(datos.servicioId),
    )
  ) {
    throw crearErrorServidor(
      "RELACION_INVALIDA",
      "El servicio no pertenece a la cita indicada.",
      409,
    );
  }

  if (!groomer || groomer.rol !== "groomer" || groomer.activo !== true) {
    throw crearErrorServidor(
      "RELACION_INVALIDA",
      "El Groomer indicado no existe o no se encuentra activo.",
      409,
    );
  }

  const [tareas, citas] = await Promise.all([
    listarTareasPersistidas(),
    listarCitasPersistidas(),
  ]);

  if (haySolapamientoTarea(tareas, citas, datos, idExcluir)) {
    throw crearErrorServidor(
      "HORARIO_SOLAPADO",
      "El Groomer ya tiene una tarea asignada en ese horario.",
      409,
    );
  }

  return cita;
}
