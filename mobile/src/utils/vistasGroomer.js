export function fechaLocalISO(fecha = new Date()) {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function textoOVacio(valor, ausente) {
  const texto = String(valor ?? '').trim();
  return texto || ausente;
}

export function citasDesdeTareas(tareas) {
  const mapa = new Map();

  for (const tarea of tareas ?? []) {
    if (!tarea?.citaEncontrada || !tarea.citaId) {
      continue;
    }

    let cita = mapa.get(tarea.citaId);

    if (!cita) {
      cita = {
        id: tarea.citaId,
        fecha: tarea.fecha || '',
        fechaTexto: tarea.fechaTexto || 'Sin fecha',
        horaInicio: tarea.citaHoraInicio || '',
        horaFin: tarea.citaHoraFin || '',
        perro: textoOVacio(tarea.perro, 'Sin nombre'),
        raza: tarea.raza || '',
        perroId: tarea.perroId || '',
        cliente: textoOVacio(tarea.cliente, 'Sin nombre'),
        clienteId: tarea.clienteId || '',
        estado: tarea.citaEstado || '',
        observaciones: tarea.citaObservaciones || '',
        tareas: [],
      };
      mapa.set(tarea.citaId, cita);
    }

    cita.tareas.push(tarea);
  }

  for (const cita of mapa.values()) {
    if (!cita.horaInicio) {
      cita.horaInicio = cita.tareas.map((t) => t.horaInicio).filter(Boolean).sort()[0] || '';
    }

    if (!cita.horaFin) {
      const fines = cita.tareas.map((t) => t.horaFin).filter(Boolean).sort();
      cita.horaFin = fines[fines.length - 1] || '';
    }
  }

  return [...mapa.values()].sort((a, b) =>
    `${a.fecha} ${a.horaInicio}`.localeCompare(`${b.fecha} ${b.horaInicio}`),
  );
}

export function clientesDesdeTareas(tareas) {
  const mapa = new Map();

  for (const tarea of tareas ?? []) {
    if (!tarea?.clienteId) {
      continue;
    }

    let cliente = mapa.get(tarea.clienteId);

    if (!cliente) {
      cliente = {
        id: tarea.clienteId,
        nombre: textoOVacio(tarea.cliente, 'Sin nombre'),
        telefono: tarea.telefono || '',
        correo: tarea.correo || '',
        perros: [],
      };
      mapa.set(tarea.clienteId, cliente);
    }

    if (
      tarea.perroId &&
      !cliente.perros.some((perro) => perro.id === tarea.perroId)
    ) {
      cliente.perros.push({
        id: tarea.perroId,
        nombre: textoOVacio(tarea.perro, 'Sin nombre'),
        raza: tarea.raza || '',
        sexo: tarea.sexo || '',
        fechaNacimiento: tarea.fechaNacimiento || '',
        notas: tarea.notasPerro || '',
      });
    }
  }

  return [...mapa.values()].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
}

export function motivoNoFinalizar(cita) {
  if (!cita) {
    return 'No se encontró la cita entre tus tareas.';
  }

  if (cita.estado !== 'en_proceso') {
    return 'Solo puede finalizarse una cita en proceso.';
  }

  if (
    !Array.isArray(cita.tareas) ||
    cita.tareas.length === 0 ||
    cita.tareas.some((tarea) => tarea.estado !== 'completada')
  ) {
    return 'La cita no puede finalizarse mientras existan tareas pendientes.';
  }

  return '';
}

export function serviciosDeCita(cita) {
  return [
    ...new Set((cita?.tareas ?? []).map((tarea) => tarea.servicio).filter(Boolean)),
  ];
}
