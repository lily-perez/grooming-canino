import { tieneErrores } from "@/utils/validacionesServiciosTareas";

const CORREO_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarCliente(datos = {}) {
  const erroresCampos = {};
  const nombre = String(datos.nombre ?? "").trim();
  const telefono = String(datos.telefono ?? "").trim();
  const correo = String(datos.correo ?? "").trim().toLowerCase();
  const observaciones = String(datos.observaciones ?? "").trim();

  if (!nombre) {
    erroresCampos.nombre = "El nombre es obligatorio.";
  }

  if (!telefono) {
    erroresCampos.telefono = "El teléfono es obligatorio.";
  }

  if (correo && !CORREO_REGEX.test(correo)) {
    erroresCampos.correo = "Ingresa un correo válido.";
  }

  return {
    datos: {
      nombre,
      telefono,
      correo,
      observaciones,
    },
    erroresCampos,
  };
}

export function tieneErroresCliente(erroresCampos) {
  return tieneErrores(erroresCampos);
}
