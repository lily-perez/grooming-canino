import {
  GoogleAuthProvider,
  browserLocalPersistence,
  getAuth,
  initializeAuth,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

export {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
};

export function crearAuth(aplicacion) {
  try {
    return initializeAuth(aplicacion, {
      persistence: browserLocalPersistence,
    });
  } catch (error) {
    const yaIniciado =
      error?.code === 'auth/already-initialized' ||
      String(error?.message || '').toLowerCase().includes('already');

    if (yaIniciado) {
      return getAuth(aplicacion);
    }

    throw error;
  }
}
