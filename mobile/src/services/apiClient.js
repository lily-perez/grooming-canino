import { API_URL } from '../config';

export class ErrorApi extends Error {
  constructor(mensaje, status = 0, detalle = null) {
    super(mensaje);
    this.name = 'ErrorApi';
    this.status = status;
    this.detalle = detalle;
  }
}

function extraerMensaje(json) {
  if (!json) {
    return null;
  }

  if (typeof json.error === 'string') {
    return json.error;
  }

  return json.error?.mensaje ?? json.mensaje ?? null;
}

async function solicitar(ruta, opciones = {}) {
  let respuesta;

  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      credentials: 'include', // envía y guarda la cookie de sesión
      ...opciones,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...opciones.headers,
      },
    });
  } catch {
    throw new ErrorApi('No se pudo conectar con el servidor.');
  }

  let json = null;

  try {
    json = await respuesta.json();
  } catch {
    // respuesta sin cuerpo JSON
  }

  if (!respuesta.ok) {
    throw new ErrorApi(
      extraerMensaje(json) ?? `Error del servidor (${respuesta.status}).`,
      respuesta.status,
      json,
    );
  }

  return json;
}

export async function apiGet(ruta) {
  const json = await solicitar(ruta);
  return json?.data;
}

export async function apiPost(ruta, cuerpo) {
  const json = await solicitar(ruta, {
    method: 'POST',
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  return json?.data;
}

export async function apiPatch(ruta, cuerpo) {
  const json = await solicitar(ruta, {
    method: 'PATCH',
    body: JSON.stringify(cuerpo),
  });
  return json?.data;
}