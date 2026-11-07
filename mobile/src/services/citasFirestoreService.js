
import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

import { db } from '../config/firebase';
import { formatearFecha } from '../utils/formato';

// Convierte una fecha de Firestore al formato YYYY-MM-DD.
function normalizarFecha(valor) {
  if (typeof valor === 'string') {
    return valor.trim().slice(0, 10);
  }

  if (valor && typeof valor.toDate === 'function') {
    const fecha = valor.toDate();

    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }

  return '';
}

// Consulta las citas asignadas al usuario autenticado.
// La colección y el campo de asignación deben confirmarse con el equipo.
export async function obtenerCitasAsignadas(groomerUid) {
  if (!groomerUid) {
    throw new Error('No se identificó al groomer autenticado.');
  }

  const consulta = query(
    collection(db, 'citas'),
    where('groomerUid', '==', groomerUid),
  );

  const resultado = await getDocs(consulta);

  return resultado.docs
    .map((documento) => {
      const datos = documento.data();
      const fecha = normalizarFecha(datos.fecha);

      return {
        ...datos,
        id: documento.id,
        fecha,
        fechaTexto: fecha
          ? formatearFecha(fecha)
          : 'Sin fecha',
      };
    })
    .sort((a, b) =>
      `${a.fecha} ${a.horaInicio ?? ''}`.localeCompare(
        `${b.fecha} ${b.horaInicio ?? ''}`,
      ),
    );
}
