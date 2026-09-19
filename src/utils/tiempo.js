export const HORA_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;
export const FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const DIAS_SEMANA = [
  "domingo",
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
];

export function esHoraValida(hora) {
  return HORA_REGEX.test(String(hora ?? "").trim());
}

export function esFechaValida(fecha) {
  if (!FECHA_REGEX.test(String(fecha ?? "").trim())) {
    return false;
  }

  const [anio, mes, dia] = fecha.split("-").map(Number);
  const date = new Date(anio, mes - 1, dia);

  return (
    date.getFullYear() === anio &&
    date.getMonth() === mes - 1 &&
    date.getDate() === dia
  );
}

export function horaAMinutos(hora) {
  const [horas, minutos] = String(hora).split(":").map(Number);
  return horas * 60 + minutos;
}

export function minutosAHora(totalMinutos) {
  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;

  return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
}

export function sumarMinutosAHora(hora, minutos) {
  return minutosAHora(horaAMinutos(hora) + Number(minutos));
}

export function diaSemanaDeFecha(fecha) {
  const [anio, mes, dia] = String(fecha).split("-").map(Number);
  return DIAS_SEMANA[new Date(anio, mes - 1, dia).getDay()];
}

export function intervaloDentroDeHorario(horaInicio, horaFin, horarioInicio, horarioFin) {
  return horaInicio >= horarioInicio && horaFin <= horarioFin;
}
