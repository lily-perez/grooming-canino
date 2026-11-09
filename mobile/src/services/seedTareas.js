import {
  collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where,
} from 'firebase/firestore';

import { db } from '../config/firebase';
import { ESTADOS } from '../utils/formato';
import { fechaLocalISO } from '../utils/vistasGroomer';

export async function sembrarDatosDemo(groomerUid) {
  const snap = await getDocs(
    query(collection(db, 'citas'), where('groomerUid', '==', groomerUid)),
  );
  let citas = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  if (citas.length === 0) {
    const ref = doc(db, 'citas', `demo-${groomerUid}`);
    const demo = {
      cliente: 'Cliente prueba',
      estado: 'programada',
      fecha: fechaLocalISO(),
      groomerUid,
      horaInicio: '09:00',
      horaFin: '10:30',
      perro: 'Max',
      raza: 'Golden Retriever',
      servicio: 'Baño y corte',
    };
    await setDoc(ref, demo);
    citas = [{ id: ref.id, ...demo }];
  }

  for (const cita of citas) {
    const partes = String(cita.servicio || 'Servicio')
      .split(/\s+y\s+/i)
      .map((s) => s.trim())
      .filter(Boolean);

    for (let i = 0; i < partes.length; i += 1) {
      const ref = doc(db, 'tareas', `${cita.id}_${i + 1}`);
      if ((await getDoc(ref)).exists()) continue;

      await setDoc(ref, {
        citaId: cita.id,
        groomerUid,
        nombre: partes[i].charAt(0).toUpperCase() + partes[i].slice(1),
        servicio: cita.servicio ?? '',
        estado: ESTADOS.PENDIENTE,
        horaInicio: cita.horaInicio ?? '',
        horaFin: cita.horaFin ?? '',
        observaciones: '',
        fecha: cita.fecha ?? '',
        perro: cita.perro ?? '',
        raza: cita.raza ?? '',
        cliente: cita.cliente ?? '',
        creadoEn: serverTimestamp(),
      });
    }
  }
}