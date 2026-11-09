import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoogleAuthProvider,
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
} from '@firebase/auth';

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
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    return authYaIniciado(aplicacion, error);
  }
}

function authYaIniciado(aplicacion, error) {
  const yaIniciado =
    error?.code === 'auth/already-initialized' ||
    String(error?.message || '').toLowerCase().includes('already');

  if (yaIniciado) {
    return getAuth(aplicacion);
  }

  throw error;
}
