import { listarCitasPersistidas } from "@/server/persistencia/citasAdapter";
import { listarClientesPersistidos } from "@/server/persistencia/clientesAdapter";
import {
  CAMPOS_OBSERVACION,
  obtenerRegistroAtencionPorCitaId,
} from "@/server/persistencia/historialAdapter";
import { listarPerrosPersistidos } from "@/server/persistencia/perrosAdapter";
import {
  listarUsuariosPersistidos,
  sanitizarUsuario,
} from "@/server/persistencia/usuariosAdapter";
import { crearErrorServidor } from "@/server/respuestas";

export { CAMPOS_OBSERVACION };

export function extraerObservaciones(body) {
  const origen = body && typeof body === "object" ? body : {};
  const datos = {};
  const erroresCampos = {};

  for (const campo of CAMPOS_OBSERVACION) {
    const valor = origen[campo];

    if (valor === undefined || valor === null || valor === "") {
      datos[campo] = "";
      continue;
    }

    if (typeof valor !== "string") {
      erroresCampos[campo] = "Debe ser texto.";
      continue;
    }

    datos[campo] = valor.trim();
  }

  return { datos, erroresCampos };
}

export function tieneErroresObservacion(erroresCampos) {
  return Object.keys(erroresCampos).length > 0;
}

export function fechaRegistroServidor() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Guatemala",
  }).format(new Date());
}

export async function asegurarRegistroUnicoPorCita(citaId) {
  const existente = await obtenerRegistroAtencionPorCitaId(citaId);

  if (existente) {
    throw crearErrorServidor(
      "REGISTRO_YA_EXISTE",
      "Esta cita ya tiene un registro de atención.",
      409,
    );
  }
}

export function componerVistaHistorial(registro, relaciones = {}) {
  if (!registro) {
    return null;
  }

  const { cita = null, perro = null, cliente = null, usuario = null } =
    relaciones;

  return {
    ...registro,
    cita: cita
      ? {
          id: cita.id,
          fecha: cita.fecha,
          horaInicio: cita.horaInicio,
          horaFinEstimada: cita.horaFinEstimada,
          estado: cita.estado,
        }
      : null,
    perro: perro
      ? {
          id: perro.id,
          nombre: perro.nombre,
        }
      : null,
    cliente: cliente
      ? {
          id: cliente.id,
          nombre: cliente.nombre,
        }
      : null,
    registradoPor: usuario
      ? {
          id: usuario.id,
          nombre: usuario.nombre,
        }
      : null,
  };
}

export async function componerVistasHistorial(registros) {
  if (!Array.isArray(registros) || registros.length === 0) {
    return [];
  }

  const [citas, perros, clientes, usuarios] = await Promise.all([
    listarCitasPersistidas(),
    listarPerrosPersistidos(),
    listarClientesPersistidos(),
    listarUsuariosPersistidos(),
  ]);

  const citasPorId = new Map(citas.map((cita) => [String(cita.id), cita]));
  const perrosPorId = new Map(perros.map((perro) => [String(perro.id), perro]));
  const clientesPorId = new Map(
    clientes.map((cliente) => [String(cliente.id), cliente]),
  );
  const usuariosPorId = new Map(
    usuarios.map((usuario) => [String(usuario.id), sanitizarUsuario(usuario)]),
  );

  return registros
    .map((registro) => {
      const cita = citasPorId.get(String(registro.citaId)) || null;
      const perro =
        perrosPorId.get(String(registro.perroId)) ||
        (cita ? perrosPorId.get(String(cita.perroId)) : null);
      const cliente = perro
        ? clientesPorId.get(String(perro.clienteId)) || null
        : null;
      const usuario =
        usuariosPorId.get(String(registro.registradoPorUsuarioId)) || null;

      return componerVistaHistorial(registro, {
        cita,
        perro,
        cliente,
        usuario,
      });
    })
    .sort((a, b) => {
      const porFecha = String(b.fecha).localeCompare(String(a.fecha));
      if (porFecha !== 0) {
        return porFecha;
      }
      return String(b.id).localeCompare(String(a.id));
    });
}
