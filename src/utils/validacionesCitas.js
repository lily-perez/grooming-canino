const HORA_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export const ESTADOS_CITA = [
  "programada",
  "completada",
  "cancelada",
];

export function validarCita(datos = {}) {
  const erroresCampos = {};

  const clienteId = String(datos.clienteId ?? "").trim();
  const perroId = String(datos.perroId ?? "").trim();
  const groomerId = String(datos.groomerId ?? "").trim();
  const servicioId = String(datos.servicioId ?? "").trim();
  const fecha = String(datos.fecha ?? "").trim();
  const horaInicio = String(datos.horaInicio ?? "").trim();
  const horaFin = String(datos.horaFin ?? "").trim();
  const estado = String(datos.estado ?? "programada").trim();
  const observaciones = String(datos.observaciones ?? "").trim();

  if (!clienteId) {
    erroresCampos.clienteId = "Selecciona un cliente.";
  }

  if (!perroId) {
    erroresCampos.perroId = "Selecciona un perro.";
  }

  if (!groomerId) {
    erroresCampos.groomerId = "Selecciona un groomer.";
  }

  if (!servicioId) {
    erroresCampos.servicioId = "Selecciona un servicio.";
  }

  if (!fecha) {
    erroresCampos.fecha = "La fecha es obligatoria.";
  }

  if (!HORA_REGEX.test(horaInicio)) {
    erroresCampos.horaInicio = "Ingresa una hora de inicio válida.";
  }

  if (!HORA_REGEX.test(horaFin)) {
    erroresCampos.horaFin = "Ingresa una hora de finalización válida.";
  }

  if (
    HORA_REGEX.test(horaInicio) &&
    HORA_REGEX.test(horaFin) &&
    horaFin <= horaInicio
  ) {
    erroresCampos.horaFin =
      "La hora de finalización debe ser posterior a la hora de inicio.";
  }

  if (!ESTADOS_CITA.includes(estado)) {
    erroresCampos.estado = "El estado de la cita no es válido.";
  }

  return {
    datos: {
      clienteId,
      perroId,
      groomerId,
      servicioId,
      fecha,
      horaInicio,
      horaFin,
      estado,
      observaciones,
    },
    erroresCampos,
  };
}

export function tieneErroresCita(erroresCampos) {
  return Object.keys(erroresCampos).length > 0;
}

export function hayCruceHorario(citas, nuevaCita, idExcluir = null) {
  return citas.some((cita) => {
    if (idExcluir && String(cita.id) === String(idExcluir)) {
      return false;
    }

    if (cita.estado === "cancelada") {
      return false;
    }

    const mismoGroomer =
      String(cita.groomerId) === String(nuevaCita.groomerId);

    const mismaFecha = cita.fecha === nuevaCita.fecha;

    const horariosSeCruzan =
      nuevaCita.horaInicio < cita.horaFin &&
      nuevaCita.horaFin > cita.horaInicio;

    return mismoGroomer && mismaFecha && horariosSeCruzan;
  });
}