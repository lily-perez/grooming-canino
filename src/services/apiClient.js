import { crearErrorApi } from "@/utils/errores";

async function procesarRespuesta(response) {
  if (response.status === 204) {
    return null;
  }

  const contenido = await response.text();
  let datos = null;

  if (contenido) {
    try {
      datos = JSON.parse(contenido);
    } catch {
      if (!response.ok) {
        throw crearErrorApi(
          {
            codigo: "ERROR_RESPUESTA",
            mensaje: "La API devolvió una respuesta no válida.",
          },
          response.status,
        );
      }

      datos = contenido;
    }
  }

  if (!response.ok) {
    throw crearErrorApi(datos, response.status);
  }

  return datos;
}

async function solicitar(ruta, opciones = {}) {
  const { method = "GET", headers = {}, body, ...otrasOpciones } = opciones;
  const esFormData =
    typeof FormData !== "undefined" && body instanceof FormData;
  const headersFinales = {
    Accept: "application/json",
    ...(!esFormData && body !== undefined
      ? { "Content-Type": "application/json" }
      : {}),
    ...headers,
  };

  try {
    const response = await fetch(ruta, {
      ...otrasOpciones,
      method,
      headers: headersFinales,
      body:
        body === undefined || esFormData || typeof body === "string"
          ? body
          : JSON.stringify(body),
    });

    return await procesarRespuesta(response);
  } catch (error) {
    if (error && typeof error === "object" && "status" in error) {
      throw error;
    }

    throw crearErrorApi(
      {
        codigo: "ERROR_COMUNICACION",
        mensaje: "No fue posible comunicarse con la API.",
      },
      0,
    );
  }
}

export const apiClient = {
  get(ruta, opciones) {
    return solicitar(ruta, { ...opciones, method: "GET" });
  },
  post(ruta, body, opciones) {
    return solicitar(ruta, { ...opciones, method: "POST", body });
  },
  put(ruta, body, opciones) {
    return solicitar(ruta, { ...opciones, method: "PUT", body });
  },
  patch(ruta, body, opciones) {
    return solicitar(ruta, { ...opciones, method: "PATCH", body });
  },
  delete(ruta, opciones) {
    return solicitar(ruta, { ...opciones, method: "DELETE" });
  },
};

export default apiClient;
