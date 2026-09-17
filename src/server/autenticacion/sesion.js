import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { crearErrorServidor } from "@/server/respuestas";

export const NOMBRE_COOKIE_SESION = "grooming_sesion";
const DURACION_SESION_SEGUNDOS = 8 * 60 * 60;

function obtenerSecreto() {
  const secreto = process.env.AUTH_SESSION_SECRET?.trim();

  if (!secreto) {
    throw crearErrorServidor(
      "CONFIGURACION_INCOMPLETA",
      "La sesión del servidor no está configurada.",
      500,
    );
  }

  return secreto;
}

function firmar(contenido) {
  return createHmac("sha256", obtenerSecreto())
    .update(contenido)
    .digest("base64url");
}

function crearToken(usuarioId) {
  const payload = Buffer.from(
    JSON.stringify({
      usuarioId: String(usuarioId),
      exp: Math.floor(Date.now() / 1000) + DURACION_SESION_SEGUNDOS,
    }),
  ).toString("base64url");

  return `${payload}.${firmar(payload)}`;
}

function verificarToken(token) {
  try {
    const [payloadCodificado, firmaRecibida, fragmentoExtra] = token.split(".");

    if (!payloadCodificado || !firmaRecibida || fragmentoExtra) {
      return null;
    }

    const firmaEsperada = firmar(payloadCodificado);
    const bufferRecibido = Buffer.from(firmaRecibida);
    const bufferEsperado = Buffer.from(firmaEsperada);

    if (
      bufferRecibido.length !== bufferEsperado.length ||
      !timingSafeEqual(bufferRecibido, bufferEsperado)
    ) {
      return null;
    }

    const payload = JSON.parse(
      Buffer.from(payloadCodificado, "base64url").toString("utf8"),
    );

    if (
      typeof payload.usuarioId !== "string" ||
      typeof payload.exp !== "number" ||
      payload.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return payload;
  } catch (error) {
    if (error && typeof error === "object" && error.status === 500) {
      throw error;
    }

    return null;
  }
}

export async function crearSesion(usuarioId) {
  const cookieStore = await cookies();

  cookieStore.set(NOMBRE_COOKIE_SESION, crearToken(usuarioId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DURACION_SESION_SEGUNDOS,
  });
}

export async function obtenerPayloadSesion() {
  const cookieStore = await cookies();
  const token = cookieStore.get(NOMBRE_COOKIE_SESION)?.value;

  return token ? verificarToken(token) : null;
}

export async function eliminarSesion() {
  const cookieStore = await cookies();

  cookieStore.set(NOMBRE_COOKIE_SESION, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
