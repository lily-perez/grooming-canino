export { finalizarCita } from './tareasService';

import { collection, addDoc, getDocs, query, orderBy, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase'; 

export const registrarAtencion = async (datosAtencion) => {
  try {
    const docRef = await addDoc(collection(db, 'historial'), {
      ...datosAtencion,
      fechaRegistro: serverTimestamp(),
    });
    return { id: docRef.id, ...datosAtencion };
  } catch (error) {
    console.error("Error al guardar el historial en Firestore:", error);
    throw error;
  }
};

export const obtenerHistorial = async (groomerId = null) => {
  try {
    const historialRef = collection(db, 'historial');
    let q;

    if (groomerId) {
      // Si se pasa el ID del groomer, trae solo sus atenciones
      q = query(historialRef, where('groomerId', '==', groomerId), orderBy('fechaRegistro', 'desc'));
    } else {
      // Si no, trae todo el historial general
      q = query(historialRef, orderBy('fechaRegistro', 'desc'));
    }

    const querySnapshot = await getDocs(q);
    const historial = [];
    
    querySnapshot.forEach((doc) => {
      historial.push({ id: doc.id, ...doc.data() });
    });

    return historial;
  } catch (error) {
    console.error("Error al obtener el historial de Firestore:", error);
    throw error;
  }
};