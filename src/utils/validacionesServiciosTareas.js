const HORA_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export const ESTADOS_TAREA = ["pendiente", "en_proceso", "completada"];

export function tieneErrores(erroresCampos) {
  return Object.keys(erroresCampos).length > 0;
}

export function validarServicio(datos = {}) {
  const erroresCampos = {};
  const nombre = String(datos.nombre ?? "").trim();
  const descripcion = String(datos.descripcion ?? "").trim();
  const duracionEstimadaMinutos = Number(datos.duracionEstimadaMinutos);

  if (!nombre) {
    erroresCampos.nombre = "El nombre es obligatorio.";
  }

  if (
    !Number.isFinite(duracionEstimadaMinutos) ||
    duracionEstimadaMinutos <= 0
  ) {
    erroresCampos.duracionEstimadaMinutos =
      "La duración estimada debe ser mayor que cero.";
  }

  return {
    datos: {
      nombre,
      descripcion,
      duracionEstimadaMinutos,
    },
    erroresCampos,
  };
}

export function validarTarea(datos = {}) {
  const erroresCampos = {};
  const citaId = String(datos.citaId ?? "").trim();
  const servicioId = String(datos.servicioId ?? "").trim();
  const nombre = String(datos.nombre ?? "").trim();
  const groomerId = String(datos.groomerId ?? "").trim();
  const horaInicio = String(datos.horaInicio ?? "").trim();
  const horaFin = String(datos.horaFin ?? "").trim();
  const observaciones = String(datos.observaciones ?? "").trim();

  if (!citaId) {
    erroresCampos.citaId = "La cita es obligatoria.";
  }

  if (!servicioId) {
    erroresCampos.servicioId = "El servicio es obligatorio.";
  }

  if (!nombre) {
    erroresCampos.nombre = "El nombre es obligatorio.";
  }

  if (!groomerId) {
    erroresCampos.groomerId = "El Groomer es obligatorio.";
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

  return {
    datos: {
      citaId,
      servicioId,
      nombre,
      groomerId,
      horaInicio,
      horaFin,
      observaciones,
    },
    erroresCampos,
  };
}

export function validarTransicionTarea(estadoActual, estadoNuevo) {
  const transiciones = {
    pendiente: "en_proceso",
    en_proceso: "completada",
  };

  return (
    ESTADOS_TAREA.includes(estadoActual) &&
    transiciones[estadoActual] === estadoNuevo
  );
}

export function haySolapamientoTareaEnFecha(
  tareas,
  citas,
  { groomerId, fecha, horaInicio, horaFin },
  idExcluir = null,
) {
  const citasPorId = new Map(citas.map((cita) => [String(cita.id), cita]));

  if (!fecha) {
    return false;
  }

  return tareas.some((tarea) => {
    if (idExcluir && String(tarea.id) === String(idExcluir)) {
      return false;
    }

    const cita = citasPorId.get(String(tarea.citaId));

    if (!cita || cita.estado === "cancelada") {
      return false;
    }

    return (
      String(tarea.groomerId) === String(groomerId) &&
      cita.fecha === fecha &&
      horaInicio < tarea.horaFin &&
      horaFin > tarea.horaInicio
    );
  });
}

export function haySolapamientoTarea(
  tareas,
  citas,
  nuevaTarea,
  idExcluir = null,
) {
  const citasPorId = new Map(citas.map((cita) => [String(cita.id), cita]));
  const nuevaCita = citasPorId.get(String(nuevaTarea.citaId));

  return haySolapamientoTareaEnFecha(
    tareas,
    citas,
    {
      groomerId: nuevaTarea.groomerId,
      fecha: nuevaCita?.fecha,
      horaInicio: nuevaTarea.horaInicio,
      horaFin: nuevaTarea.horaFin,
    },
    idExcluir,
  );
}
