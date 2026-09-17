const CORREO_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const ROLES_PERMITIDOS = ["administrador", "groomer"];

export function normalizarCorreo(correo = "") {
  return correo.trim().toLowerCase();
}

function validarNombre(nombre, erroresCampos) {
  const nombreNormalizado = typeof nombre === "string" ? nombre.trim() : "";

  if (!nombreNormalizado) {
    erroresCampos.nombre = "El nombre es obligatorio.";
  } else if (nombreNormalizado.length < 2 || nombreNormalizado.length > 100) {
    erroresCampos.nombre = "El nombre debe tener entre 2 y 100 caracteres.";
  }

  return nombreNormalizado;
}

function validarCorreo(correo, erroresCampos) {
  const correoNormalizado =
    typeof correo === "string" ? normalizarCorreo(correo) : "";

  if (!correoNormalizado) {
    erroresCampos.correo = "El correo es obligatorio.";
  } else if (!CORREO_REGEX.test(correoNormalizado)) {
    erroresCampos.correo = "Ingresa un correo válido.";
  }

  return correoNormalizado;
}

export function validarRegistro(datos = {}) {
  const erroresCampos = {};
  const nombre = validarNombre(datos.nombre, erroresCampos);
  const correo = validarCorreo(datos.correo, erroresCampos);
  const contrasena =
    typeof datos.contrasena === "string" ? datos.contrasena : "";

  if (!contrasena) {
    erroresCampos.contrasena = "La contraseña es obligatoria.";
  } else if (contrasena.length < 8 || contrasena.length > 128) {
    erroresCampos.contrasena =
      "La contraseña debe tener entre 8 y 128 caracteres.";
  }

  return { datos: { nombre, correo, contrasena }, erroresCampos };
}

export function validarLogin(datos = {}) {
  const erroresCampos = {};
  const correo = validarCorreo(datos.correo, erroresCampos);
  const contrasena =
    typeof datos.contrasena === "string" ? datos.contrasena : "";

  if (!contrasena) {
    erroresCampos.contrasena = "La contraseña es obligatoria.";
  }

  return { datos: { correo, contrasena }, erroresCampos };
}

export function validarActualizacionUsuario(datos = {}) {
  const erroresCampos = {};
  const nombre = validarNombre(datos.nombre, erroresCampos);
  const correo = validarCorreo(datos.correo, erroresCampos);
  const rol = typeof datos.rol === "string" ? datos.rol : "";

  if (!ROLES_PERMITIDOS.includes(rol)) {
    erroresCampos.rol = "El rol indicado no es válido.";
  }

  return { datos: { nombre, correo, rol }, erroresCampos };
}

export function tieneErrores(erroresCampos) {
  return Object.keys(erroresCampos).length > 0;
}
