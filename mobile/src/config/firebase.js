import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

import { PROYECTO_FIREBASE, motivoConfiguracionInvalida } from '../domain/acceso.mjs';
import { crearAuth } from './sdkAuth';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'TU_API_KEY',
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    'grooming-canino-udb.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || PROYECTO_FIREBASE,
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    'grooming-canino-udb.appspot.com',
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abcdef',
};

export function afirmarConfiguracionFirebase() {
  const motivo = motivoConfiguracionInvalida(firebaseConfig);

  if (motivo) {
    throw new Error(motivo);
  }
}

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = crearAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleWebClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '';
