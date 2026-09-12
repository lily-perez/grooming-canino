import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scrypt = promisify(scryptCallback);
const LONGITUD_HASH = 64;

export async function crearHashContrasena(contrasena) {
  const salt = randomBytes(16);
  const hash = await scrypt(contrasena, salt, LONGITUD_HASH);

  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export async function verificarContrasena(contrasena, hashGuardado = "") {
  const [algoritmo, saltHex, hashHex] = hashGuardado.split("$");

  if (algoritmo !== "scrypt" || !saltHex || !hashHex) {
    return false;
  }

  try {
    const hashEsperado = Buffer.from(hashHex, "hex");
    const hashRecibido = await scrypt(
      contrasena,
      Buffer.from(saltHex, "hex"),
      hashEsperado.length,
    );

    return (
      hashEsperado.length === hashRecibido.length &&
      timingSafeEqual(hashEsperado, hashRecibido)
    );
  } catch {
    return false;
  }
}
