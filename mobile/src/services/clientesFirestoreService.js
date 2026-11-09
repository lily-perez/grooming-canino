import { db } from '../config/firebase';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

const clientesCollectionRef = collection(db, 'clientes');

// Obtener todos los clientes
export async function obtenerClientes() {
  try {
    const data = await getDocs(clientesCollectionRef);
    return data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error al obtener clientes: ", error);
    throw error;
  }
}

// Agregar un nuevo cliente y sus perros
export async function agregarCliente(clienteData) {
  try {
    const docRef = await addDoc(clientesCollectionRef, clienteData);
    return docRef.id;
  } catch (error) {
    console.error("Error al agregar cliente: ", error);
    throw error;
  }
}