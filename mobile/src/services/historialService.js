import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';

import { db } from '../config/firebase';
export { finalizarCita } from './tareasService';

const CAMPOS_OBSERVACION = [
  'ojos',
  'oidos',
  'dientes',
  'pelaje',
  'comportamiento',
  'unas',
  'puntualidad',
  'observaciones',
];

function normalizarDatosAtencion(datos = {}) {
  const observaciones = {};

  for (const campo of CAMPOS_OBSERVACION) {
    observaciones[campo] = String(datos[campo] ?? '').trim();
  }

  const groomerUid =
    datos.groomerId ??
    datos.groomerUid ??
    datos.registradoPorUsuarioId ??
    null;

  return {
    citaId: datos.citaId ? String(datos.citaId) : null,
    perroId: datos.perroId ? String(datos.perroId) : null,
    perro: datos.perro ? String(datos.perro).trim() : 'Sin nombre',
    clienteId: datos.clienteId ? String(datos.clienteId) : null,
    groomerId: groomerUid,
    groomerUid,
    registradoPorUsuarioId: groomerUid,
    groomerEmail: datos.groomerEmail ?? null,
    fecha: datos.fecha ? String(datos.fecha).trim() : '',
    ...observaciones,
  };
}

export const registrarAtencion = async (datosAtencion) => {
  try {
    const payload = normalizarDatosAtencion(datosAtencion);

    const docRef = await addDoc(collection(db, 'historial'), {
      ...payload,
      fechaRegistro: serverTimestamp(),
    });

    return { id: docRef.id, ...payload };
  } catch (error) {
    console.error('Error al guardar el historial en Firestore:', error);
    throw error;
  }
};

export const obtenerHistorial = async (groomerId = null) => {
  try {
    const historialRef = collection(db, 'historial');
    const q = groomerId
      ? query(
          historialRef,
          where('groomerId', '==', groomerId),
          orderBy('fechaRegistro', 'desc'),
        )
      : query(historialRef, orderBy('fechaRegistro', 'desc'));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error al obtener el historial de Firestore:', error);
    throw error;
  }
};