import { crearErrorServidor } from "@/server/respuestas";

function obtenerBaseUrl() {
  const baseUrl = process.env.MOCK_API_BASE_URL?.trim();

  if (!baseUrl) {
    throw crearErrorServidor(
      "CONFIGURACION_INCOMPLETA",
      "La persistencia temporal no está configurada.",
      500,
    );
  }

  return baseUrl.replace(/\/+$/, "");
}

export async function solicitarMockApi(ruta, opciones = {}) {
  let response;

  try {
    response = await fetch(`${obtenerBaseUrl()}${ruta}`, {
      cache: "no-store",
      ...opciones,
      headers: {
        Accept: "application/json",
        ...(opciones.body ? { "Content-Type": "application/json" } : {}),
        ...opciones.headers,
      },
    });
  } catch (error) {
    if (error && typeof error === "object" && "status" in error) {
      throw error;
    }

    throw crearErrorServidor(
      "ERROR_PERSISTENCIA",
      "No fue posible acceder a la persistencia temporal.",
      500,
    );
  }

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw crearErrorServidor(
      "ERROR_PERSISTENCIA",
      "La persistencia temporal rechazó la operación.",
      500,
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
