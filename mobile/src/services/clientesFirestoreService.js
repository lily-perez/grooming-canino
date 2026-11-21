import { db } from '../config/firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';

const clientesCollectionRef = collection(db, 'clientes');
const perrosCollectionRef = collection(db, 'perros');

// ==========================================
// CLIENTES
// ==========================================

// Obtener todos los clientes (sin perros embebidos)
export async function obtenerClientes() {
  try {
    const data = await getDocs(clientesCollectionRef);
    return data.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
  } catch (error) {
    console.error('Error al obtener clientes: ', error);
    throw error;
  }
}

// Obtener todos los clientes con su arreglo de perros asociados (relación Cliente -> Perro)
export async function obtenerClientesConPerros() {
  try {
    const [clientesSnap, perrosSnap] = await Promise.all([
      getDocs(clientesCollectionRef),
      getDocs(perrosCollectionRef),
    ]);

    const perrosPorCliente = new Map();

    perrosSnap.forEach((docSnap) => {
      const data = docSnap.data();
      const clienteId = data.clienteId || '';
      if (!clienteId) return;

      const lista = perrosPorCliente.get(clienteId) || [];
      lista.push({
        id: docSnap.id,
        clienteId,
        nombre: data.nombre || '',
        raza: data.raza || '',
        sexo: data.sexo || '',
        fechaNacimiento: data.fechaNacimiento || '',
        notas: data.notas || '',
      });
      perrosPorCliente.set(clienteId, lista);
    });

    return clientesSnap.docs
      .map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          nombre: data.nombre || '',
          telefono: data.telefono || '',
          correo: data.correo || '',
          perros: perrosPorCliente.get(docSnap.id) || [],
        };
      })
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  } catch (error) {
    console.error('Error al obtener clientes con perros: ', error);
    throw error;
  }
}

// Agregar un nuevo cliente
export async function agregarCliente(clienteData) {
  try {
    const nombre = String(clienteData?.nombre || '').trim();
    if (!nombre) {
      throw new Error('El nombre del cliente es obligatorio.');
    }

    const payload = {
      nombre,
      telefono: String(clienteData?.telefono || '').trim(),
      correo: String(clienteData?.correo || '').trim(),
    };

    const docRef = await addDoc(clientesCollectionRef, payload);
    return docRef.id;
  } catch (error) {
    console.error('Error al agregar cliente: ', error);
    throw error;
  }
}

// Editar un cliente existente
export async function actualizarCliente(clienteId, clienteData) {
  try {
    if (!clienteId) {
      throw new Error('Falta el ID del cliente para actualizar.');
    }

    const payload = {};
    if (clienteData.nombre !== undefined) {
      const nombre = String(clienteData.nombre).trim();
      if (!nombre) {
        throw new Error('El nombre del cliente no puede quedar vacío.');
      }
      payload.nombre = nombre;
    }
    if (clienteData.telefono !== undefined) {
      payload.telefono = String(clienteData.telefono).trim();
    }
    if (clienteData.correo !== undefined) {
      payload.correo = String(clienteData.correo).trim();
    }

    const clienteDocRef = doc(db, 'clientes', clienteId);
    await updateDoc(clienteDocRef, payload);
    return { id: clienteId, ...payload };
  } catch (error) {
    console.error('Error al actualizar cliente: ', error);
    throw error;
  }
}

// ==========================================
// PERROS (Relación Cliente -> Perro mediante clienteId)
// ==========================================

// Obtener perros de un cliente específico
export async function obtenerPerrosPorCliente(clienteId) {
  try {
    if (!clienteId) return [];
    const q = query(perrosCollectionRef, where('clienteId', '==', clienteId));
    const snap = await getDocs(q);

    return snap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.error('Error al obtener perros del cliente: ', error);
    throw error;
  }
}

// Agregar un nuevo perro asociado a un cliente
export async function agregarPerro(perroData) {
  try {
    const clienteId = String(perroData?.clienteId || '').trim();
    if (!clienteId) {
      throw new Error('Todo perro debe estar asociado a un cliente (clienteId).');
    }

    const nombre = String(perroData?.nombre || '').trim();
    if (!nombre) {
      throw new Error('El nombre del perro es obligatorio.');
    }

    const payload = {
      clienteId,
      nombre,
      raza: String(perroData?.raza || '').trim(),
      sexo: String(perroData?.sexo || '').trim(),
      fechaNacimiento: String(perroData?.fechaNacimiento || '').trim(),
      notas: String(perroData?.notas || '').trim(),
    };

    const docRef = await addDoc(perrosCollectionRef, payload);
    return { id: docRef.id, ...payload };
  } catch (error) {
    console.error('Error al agregar perro: ', error);
    throw error;
  }
}

// Editar un perro existente
export async function actualizarPerro(perroId, perroData) {
  try {
    if (!perroId) {
      throw new Error('Falta el ID del perro para actualizar.');
    }

    const payload = {};
    if (perroData.clienteId !== undefined) {
      const clienteId = String(perroData.clienteId).trim();
      if (!clienteId) {
        throw new Error('El perro debe permanecer asociado a un cliente.');
      }
      payload.clienteId = clienteId;
    }
    if (perroData.nombre !== undefined) {
      const nombre = String(perroData.nombre).trim();
      if (!nombre) {
        throw new Error('El nombre del perro no puede quedar vacío.');
      }
      payload.nombre = nombre;
    }
    if (perroData.raza !== undefined) payload.raza = String(perroData.raza).trim();
    if (perroData.sexo !== undefined) payload.sexo = String(perroData.sexo).trim();
    if (perroData.fechaNacimiento !== undefined) {
      payload.fechaNacimiento = String(perroData.fechaNacimiento).trim();
    }
    if (perroData.notas !== undefined) payload.notas = String(perroData.notas).trim();

    const perroDocRef = doc(db, 'perros', perroId);
    await updateDoc(perroDocRef, payload);
    return { id: perroId, ...payload };
  } catch (error) {
    console.error('Error al actualizar perro: ', error);
    throw error;
  }
}