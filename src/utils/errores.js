const ERROR_POR_DEFECTO = {
  codigo: "ERROR_INESPERADO",
  mensaje: "Ocurrió un error inesperado.",
  erroresCampos: {},
  status: 500,
};

export function normalizarError(error, status = ERROR_POR_DEFECTO.status) {
  const datos = error && typeof error === "object" ? error : {};

  return {
    codigo: datos.codigo || ERROR_POR_DEFECTO.codigo,
    mensaje: datos.mensaje || datos.message || ERROR_POR_DEFECTO.mensaje,
    erroresCampos: datos.erroresCampos || {},
    status: datos.status ?? status,
  };
}

export function crearErrorApi(error, status) {
  const errorNormalizado = normalizarError(error, status);
  const errorApi = new Error(errorNormalizado.mensaje);

  Object.assign(errorApi, errorNormalizado);

  return errorApi;
}

export function obtenerMensajeError(error) {
  return normalizarError(error).mensaje;
}
