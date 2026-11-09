import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

import { db } from '../config/firebase';
import { obtenerCitasAsignadas } from './citasFirestoreService';

const DIAS_SEMANA = [
  'domingo',
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado',
];

export async function obtenerDisponibilidadGroomer(groomerUid) {
  if (!groomerUid) {
    throw new Error('No se identificó al groomer autenticado.');
  }

  const consultaHorarios = query(
    collection(db, 'horarios'),
    where('groomerUid', '==', groomerUid),
  );

  const [resultadoHorarios, citas] = await Promise.all([
    getDocs(consultaHorarios),
    obtenerCitasAsignadas(groomerUid),
  ]);

  const horarios = resultadoHorarios.docs
    .map((documento) => ({
      id: documento.id,
      ...documento.data(),
    }))
    .filter((horario) => horario.activo !== false)
    .sort((a, b) => {
      const indiceA = DIAS_SEMANA.indexOf(
        String(a.diaSemana || '').toLowerCase(),
      );

      const indiceB = DIAS_SEMANA.indexOf(
        String(b.diaSemana || '').toLowerCase(),
      );

      const ordenA = indiceA === -1 ? 99 : indiceA;
      const ordenB = indiceB === -1 ? 99 : indiceB;

      if (ordenA !== ordenB) {
        return ordenA - ordenB;
      }

      return String(a.horaInicio || '').localeCompare(
        String(b.horaInicio || ''),
      );
    });

  return {
    horarios,
    citas,
  };
}