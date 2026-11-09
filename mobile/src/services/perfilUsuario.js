import { doc, getDoc } from 'firebase/firestore';

import { db } from '../config/firebase';

export async function leerDocumentoUsuario(uid) {
  if (!uid) {
    return null;
  }

  const instantanea = await getDoc(doc(db, 'usuarios', uid));

  if (!instantanea.exists()) {
    return null;
  }

  const datos = instantanea.data() ?? {};

  return {
    rol: datos.rol,
    activo: datos.activo,
    nombre: typeof datos.nombre === 'string' ? datos.nombre : '',
  };
}
