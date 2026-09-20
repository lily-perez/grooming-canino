import {
  esFechaValida,
  esHoraValida,
  sumarMinutosAHora,
} from "@/utils/tiempo";
import { tieneErrores } from "@/utils/validacionesServiciosTareas";

export const ESTADOS_CITA = [
  "programada",
  "en_proceso",
  "completada",
  "cancelada",
];

export function extraerServicioIds(datos = {}) {
  const origen = Array.isArray(datos.servicioIds)
    ? datos.servicioIds
    : [datos.servicioId].filter(Boolean);

  return [...new Set(origen.map((id) => String(id ?? "").trim()).filter(Boolean))];
}

export function calcularHoraFinEstimada(horaInicio, servicios = []) {
  const duracionTotal = servicios.reduce(
    (total, servicio) => total + Number(servicio.duracionEstimadaMinutos || 0),
    0,
  );

  if (!esHoraValida(horaInicio) || duracionTotal <= 0) {
    return "";
  }

  return sumarMinutosAHora(horaInicio, duracionTotal);
}

export function validarCita(datos = {}) {
  const erroresCampos = {};
  const perroId = String(datos.perroId ?? "").trim();
  const servicioIds = extraerServicioIds(datos);
  const fecha = String(datos.fecha ?? "").trim();
  const horaInicio = String(datos.horaInicio ?? "").trim();
  const observaciones = String(datos.observaciones ?? "").trim();

  if (!perroId) {
    erroresCampos.perroId = "El perro es obligatorio.";
  }

  if (servicioIds.length === 0) {
    erroresCampos.servicioIds = "Selecciona al menos un servicio.";
  }

  if (!esFechaValida(fecha)) {
    erroresCampos.fecha = "Ingresa una fecha válida.";
  }

  if (!esHoraValida(horaInicio)) {
    erroresCampos.horaInicio = "Ingresa una hora de inicio válida.";
  }

  return {
    datos: {
      perroId,
      servicioIds,
      fecha,
      horaInicio,
      observaciones,
    },
    erroresCampos,
  };
}

export function tieneErroresCita(erroresCampos) {
  return tieneErrores(erroresCampos);
}

export function transicionCitaPermitida(estadoActual, estadoNuevo) {
  if (estadoActual === "programada" && estadoNuevo === "cancelada") {
    return true;
  }

  return false;
}
