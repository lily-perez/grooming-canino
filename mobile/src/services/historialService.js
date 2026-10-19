import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';

export const guardarRegistroAtencion = async (datosAtencion, imagenUri) => {
  try {
    let imagenUrl = '';

    if (imagenUri) {
      const response = await fetch(imagenUri);
      const blob = await response.blob();
      
      const nombreArchivo = `historial/${Date.now()}_foto.jpg`;
      const imageRef = ref(storage, nombreArchivo);
      await uploadBytes(imageRef, blob);
      imagenUrl = await getDownloadURL(imageRef);
    }

    const docRef = await addDoc(collection(db, 'historial_atencion'), {
      ...datosAtencion,
      imagenUrl: imagenUrl,
      fechaRegistro: new Date().toISOString(),
    });

    return { exito: true, id: docRef.id };
  } catch (error) {
    console.error("Error al guardar en Firebase:", error);
    return { exito: false, error: error.message };
  }
};