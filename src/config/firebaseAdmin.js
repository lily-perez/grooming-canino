import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let adminApp = null;
let firestoreInstance = null;
let authInstance = null;

function obtenerCredenciales() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();

  const privateKeyRaw =
    process.env.FIREBASE_ADMIN_PRIVATE_KEY?.trim();

  const privateKey = privateKeyRaw
    ?.replace(/^"(.*)"$/s, "$1")
    .replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Faltan credenciales de Firebase Admin en el entorno.",
    );
  }

  return {
    projectId,
    clientEmail,
    privateKey,
  };
}

function obtenerAdminApp() {
  if (adminApp) {
    return adminApp;
  }

  if (getApps().length > 0) {
    adminApp = getApps()[0];
    return adminApp;
  }

  adminApp = initializeApp({
    credential: cert(obtenerCredenciales()),
  });

  return adminApp;
}

function obtenerFirestore() {
  if (!firestoreInstance) {
    firestoreInstance = getFirestore(obtenerAdminApp());
  }

  return firestoreInstance;
}

function obtenerAuth() {
  if (!authInstance) {
    authInstance = getAuth(obtenerAdminApp());
  }

  return authInstance;
}

/*
 * Proxies para inicializar Firebase Admin únicamente cuando
 * realmente se utilice durante una petición.
 *
 * Esto evita que Next.js/Vercel intente validar las credenciales
 * mientras está recopilando las rutas durante el build.
 */
export const adminDb = new Proxy(
  {},
  {
    get(_target, propiedad) {
      const instancia = obtenerFirestore();
      const valor = instancia[propiedad];

      return typeof valor === "function"
        ? valor.bind(instancia)
        : valor;
    },
  },
);

export const adminAuth = new Proxy(
  {},
  {
    get(_target, propiedad) {
      const instancia = obtenerAuth();
      const valor = instancia[propiedad];

      return typeof valor === "function"
        ? valor.bind(instancia)
        : valor;
    },
  },
);