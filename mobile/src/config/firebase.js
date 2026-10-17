import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "grooming-canino-udb.firebaseapp.com",
  projectId: "grooming-canino-udb",
  storageBucket: "grooming-canino-udb.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);