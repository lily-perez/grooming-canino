import { adminDb } from "@/config/firebaseAdmin";
import { crearErrorServidor } from "@/server/respuestas";

function obtenerPartes(ruta) {
  const partes = String(ruta)
    .split("/")
    .filter(Boolean);

  if (partes.length < 1 || partes.length > 2) {
    throw crearErrorServidor(
      "RUTA_PERSISTENCIA_INVALIDA",
      "La ruta de persistencia no es válida.",
      500,
    );
  }

  return {
    coleccion: partes[0],
    id: partes[1] || null,
  };
}

function documentoConId(documento) {
  if (!documento.exists) {
    return null;
  }

  return {
    id: documento.id,
    ...documento.data(),
  };
}

export async function solicitarMockApi(ruta, opciones = {}) {
  try {
    const { coleccion, id } = obtenerPartes(ruta);
    const metodo = String(opciones.method || "GET").toUpperCase();
    const referenciaColeccion = adminDb.collection(coleccion);

    if (metodo === "GET" && !id) {
      const snapshot = await referenciaColeccion.get();

      return snapshot.docs.map((documento) => documentoConId(documento));
    }

    if (metodo === "GET" && id) {
      const snapshot = await referenciaColeccion.doc(id).get();
      return documentoConId(snapshot);
    }

    const datos = opciones.body ? JSON.parse(opciones.body) : {};

    if (metodo === "POST") {
      if (datos.id) {
        const { id: idDocumento, ...datosSinId } = datos;
        const referencia = referenciaColeccion.doc(String(idDocumento));

        await referencia.set(datosSinId);
        const snapshot = await referencia.get();

        return documentoConId(snapshot);
      }

      const referencia = await referenciaColeccion.add(datos);
      const snapshot = await referencia.get();

      return documentoConId(snapshot);
    }

    if (metodo === "PUT" && id) {
      const referencia = referenciaColeccion.doc(id);
      const existente = await referencia.get();

      if (!existente.exists) {
        return null;
      }

      const { id: idIgnorado, ...datosSinId } = datos;

      await referencia.set(datosSinId);
      const actualizado = await referencia.get();

      return documentoConId(actualizado);
    }

    if (metodo === "DELETE" && id) {
      await referenciaColeccion.doc(id).delete();
      return null;
    }

    throw crearErrorServidor(
      "OPERACION_PERSISTENCIA_INVALIDA",
      "La operación de persistencia no es válida.",
      500,
    );
  } catch (error) {
    if (error && typeof error === "object" && "status" in error) {
      throw error;
    }

    console.error("Error de persistencia Firestore:", error);

    throw crearErrorServidor(
      "ERROR_PERSISTENCIA",
      "No fue posible acceder a Firestore.",
      500,
    );
  }
}