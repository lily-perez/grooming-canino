import { esFechaValida } from "@/utils/tiempo";
import { tieneErrores } from "@/utils/validacionesServiciosTareas";

export function validarPerro(datos = {}) {
  const erroresCampos = {};
  const clienteId = String(datos.clienteId ?? "").trim();
  const nombre = String(datos.nombre ?? "").trim();
  const raza = String(datos.raza ?? "").trim();
  const sexo = String(datos.sexo ?? "").trim();
  const fechaNacimiento = String(datos.fechaNacimiento ?? "").trim();
  const observaciones = String(datos.observaciones ?? "").trim();

  if (!clienteId) {
    erroresCampos.clienteId = "El cliente es obligatorio.";
  }

  if (!nombre) {
    erroresCampos.nombre = "El nombre es obligatorio.";
  }

  if (fechaNacimiento && !esFechaValida(fechaNacimiento)) {
    erroresCampos.fechaNacimiento = "Ingresa una fecha de nacimiento válida.";
  }

  return {
    datos: {
      clienteId,
      nombre,
      raza,
      sexo,
      fechaNacimiento,
      observaciones,
    },
    erroresCampos,
  };
}

export function tieneErroresPerro(erroresCampos) {
  return tieneErrores(erroresCampos);
}
