import { crearErrorApi, normalizarError } from "@/utils/errores";

export function crearErrorServidor(codigo, mensaje, status, erroresCampos = {}) {
  return crearErrorApi({ codigo, mensaje, erroresCampos }, status);
}

export function respuestaError(error) {
  const normalizado = normalizarError(error);
  const esErrorConocido =
    error && typeof error === "object" && "codigo" in error && "status" in error;

  if (!esErrorConocido) {
    return Response.json(
      {
        codigo: "ERROR_INTERNO",
        mensaje: "Ocurrió un error interno.",
      },
      { status: 500 },
    );
  }

  return Response.json(
    {
      codigo: normalizado.codigo,
      mensaje: normalizado.mensaje,
      ...(Object.keys(normalizado.erroresCampos).length > 0
        ? { erroresCampos: normalizado.erroresCampos }
        : {}),
    },
    { status: normalizado.status },
  );
}

export async function leerJson(request) {
  try {
    return await request.json();
  } catch {
    throw crearErrorServidor(
      "DATOS_INVALIDOS",
      "El cuerpo de la petición no contiene JSON válido.",
      400,
    );
  }
}
