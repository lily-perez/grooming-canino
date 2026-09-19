import {
  listarCitasPersistidas,
  obtenerCitaPersistida,
} from "@/server/persistencia/citasAdapter";
import { listarHorariosPersistidos } from "@/server/persistencia/horariosAdapter";
import { obtenerServicioPersistido } from "@/server/persistencia/serviciosAdapter";
import { listarTareasPersistidas } from "@/server/persistencia/tareasAdapter";
import { obtenerUsuarioPersistido } from "@/server/persistencia/usuariosAdapter";
import {
  groomerCubreHorarioLaboral,
  validarDisponibilidadGroomer,
} from "@/server/reglas/disponibilidad";
import { crearErrorServidor } from "@/server/respuestas";
import { extraerServicioIds } from "@/utils/validacionesCitas";
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

  if (cita.estado === "cancelada" || cita.estado === "completada") {
    throw crearErrorServidor(
      "ESTADO_INVALIDO",
      "No se pueden crear ni editar tareas de una cita cancelada o completada.",
      409,
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

  const serviciosCita = extraerServicioIds(cita);

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

  const horarios = await listarHorariosPersistidos();

  if (
    !groomerCubreHorarioLaboral(
      horarios,
      datos.groomerId,
      cita.fecha,
      datos.horaInicio,
      datos.horaFin,
    )
  ) {
    throw crearErrorServidor(
      "GROOMER_NO_DISPONIBLE",
      "El horario de la tarea queda fuera del horario laboral activo del Groomer.",
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

  const disponible = await validarDisponibilidadGroomer(
    datos.groomerId,
    cita.fecha,
    datos.horaInicio,
    datos.horaFin,
    idExcluir,
  );

  if (!disponible) {
    throw crearErrorServidor(
      "GROOMER_NO_DISPONIBLE",
      "El Groomer no está disponible en el horario solicitado.",
      409,
    );
  }

  return cita;
}
