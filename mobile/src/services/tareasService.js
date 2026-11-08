import {
  collection, doc, getDocs, query, where, writeBatch, serverTimestamp,
} from 'firebase/firestore';

import { auth, db } from '../config/firebase';
import { formatearFecha } from '../utils/formato';

const idDe = (texto) =>
  String(texto ?? '').trim().toLowerCase().replace(/\s+/g, '-');

export async function obtenerMisTareas(groomerUid) {
  const [tareasSnap, citasSnap] = await Promise.all([
    getDocs(query(collection(db, 'tareas'), where('groomerUid', '==', groomerUid))),
    getDocs(query(collection(db, 'citas'), where('groomerUid', '==', groomerUid))),
  ]);

  const citas = new Map(citasSnap.docs.map((d) => [d.id, d.data()]));

  return tareasSnap.docs
    .map((d) => {
      const t = d.data();
      const cita = citas.get(String(t.citaId));
      const perro = t.perro ?? cita?.perro ?? '';
      const cliente = t.cliente ?? cita?.cliente ?? '';
      const fecha = cita?.fecha ?? t.fecha ?? '';

      return {
        id: d.id,
        citaId: String(t.citaId ?? ''),
        citaEncontrada: Boolean(cita),
        nombre: t.nombre ?? '',
        servicio: t.servicio ?? cita?.servicio ?? '',
        duracionMinutos: 0,
        estado: t.estado ?? '',
        horaInicio: t.horaInicio ?? '',
        horaFin: t.horaFin ?? '',
        observaciones: t.observaciones ?? '',
        fecha,
        fechaTexto: formatearFecha(fecha),
        citaEstado: cita?.estado ?? '',
        citaHoraInicio: cita?.horaInicio ?? '',
        citaHoraFin: cita?.horaFin ?? '',
        citaObservaciones: cita?.observaciones ?? '',
        perroId: idDe(perro),
        perro,
        raza: t.raza ?? cita?.raza ?? '',
        sexo: '',
        fechaNacimiento: '',
        notasPerro: '',
        clienteId: idDe(cliente),
        cliente,
        telefono: '',
        correo: '',
      };
    })
    .sort((a, b) =>
      `${a.fecha} ${a.horaInicio}`.localeCompare(`${b.fecha} ${b.horaInicio}`),
    );
}

// Cambia el estado, registra el cambio en "historial" y marca la cita
// como en_proceso al iniciar su primera tarea. Todo en un batch atómico.
export async function actualizarEstadoTarea(
  tareaId, estadoNuevo, estadoAnterior, groomerUid, citaId,
) {
  const batch = writeBatch(db);

  batch.update(doc(db, 'tareas', tareaId), {
    estado: estadoNuevo,
    actualizadoEn: serverTimestamp(),
  });
  batch.set(doc(collection(db, 'historial')), {
    tipo: 'cambio_estado_tarea',
    tareaId,
    citaId: citaId ?? '',
    groomerUid,
    estadoAnterior,
    estadoNuevo,
    fecha: serverTimestamp(),
  });
  if (estadoNuevo === 'en_proceso' && citaId) {
    batch.update(doc(db, 'citas', citaId), { estado: 'en_proceso' });
  }

  await batch.commit();
  return { estado: estadoNuevo };
}

// historialService la reexporta, así que se mantiene el nombre y la firma.
export async function finalizarCita(citaId, observaciones) {
  const batch = writeBatch(db);

  batch.update(doc(db, 'citas', citaId), {
    estado: 'finalizada',
    observaciones: observaciones ?? '',
    actualizadoEn: serverTimestamp(),
  });
  batch.set(doc(collection(db, 'historial')), {
    tipo: 'cita_finalizada',
    citaId,
    groomerUid: auth.currentUser?.uid ?? '',
    observaciones: observaciones ?? '',
    fecha: serverTimestamp(),
  });

  await batch.commit();
  return { estado: 'finalizada' };
}

export async function obtenerHistorial(groomerUid) {
  const snap = await getDocs(
    query(collection(db, 'historial'), where('groomerUid', '==', groomerUid)),
  );
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.fecha?.seconds ?? 0) - (a.fecha?.seconds ?? 0));
}