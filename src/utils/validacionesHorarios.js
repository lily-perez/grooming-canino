import { DIAS_SEMANA, esHoraValida } from "@/utils/tiempo";
import { tieneErrores } from "@/utils/validacionesServiciosTareas";

export function validarHorarioGroomer(datos = {}) {
  const erroresCampos = {};
  const groomerId = String(datos.groomerId ?? "").trim();
  const diaSemana = String(datos.diaSemana ?? "").trim();
  const horaInicio = String(datos.horaInicio ?? "").trim();
  const horaFin = String(datos.horaFin ?? "").trim();

  if (!groomerId) {
    erroresCampos.groomerId = "El Groomer es obligatorio.";
  }

  if (!DIAS_SEMANA.includes(diaSemana)) {
    erroresCampos.diaSemana = "Selecciona un día de la semana válido.";
  }

  if (!esHoraValida(horaInicio)) {
    erroresCampos.horaInicio = "Ingresa una hora de inicio válida.";
  }

  if (!esHoraValida(horaFin)) {
    erroresCampos.horaFin = "Ingresa una hora de finalización válida.";
  }

  if (esHoraValida(horaInicio) && esHoraValida(horaFin) && horaFin <= horaInicio) {
    erroresCampos.horaFin =
      "La hora de finalización debe ser posterior a la hora de inicio.";
  }

  return {
    datos: {
      groomerId,
      diaSemana,
      horaInicio,
      horaFin,
    },
    erroresCampos,
  };
}

export function tieneErroresHorario(erroresCampos) {
  return tieneErrores(erroresCampos);
}
