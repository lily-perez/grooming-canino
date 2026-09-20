import {
  obtenerClientePersistido,
} from "@/server/persistencia/clientesAdapter";
import { obtenerPerroPersistido } from "@/server/persistencia/perrosAdapter";
import { listarCitasPersistidas } from "@/server/persistencia/citasAdapter";
import { listarTareasPersistidas } from "@/server/persistencia/tareasAdapter";
import { crearErrorServidor } from "@/server/respuestas";

export async function validarClienteParaNuevoPerro(clienteId) {
  const cliente = await obtenerClientePersistido(clienteId);

  if (!cliente) {
    throw crearErrorServidor(
      "CLIENTE_NO_ENCONTRADO",
      "El cliente indicado no existe.",
      404,
      { clienteId: "El cliente no existe." },
    );
  }

  if (!cliente.activo) {
    throw crearErrorServidor(
      "RELACION_INVALIDA",
      "Solo un cliente activo puede recibir un perro nuevo.",
      409,
      { clienteId: "El cliente se encuentra inactivo." },
    );
  }

  return cliente;
}

export async function validarPerroYClienteDeCita(perroId) {
  const perro = await obtenerPerroPersistido(perroId);

  if (!perro) {
    throw crearErrorServidor(
      "PERRO_NO_ENCONTRADO",
      "El perro indicado no existe.",
      404,
      { perroId: "El perro no existe o no está registrado." },
    );
  }

  if (!perro.activo) {
    throw crearErrorServidor(
      "RELACION_INVALIDA",
      "Solo un perro activo puede usarse para una cita nueva o reprogramada.",
      409,
      { perroId: "El perro se encuentra inactivo." },
    );
  }

  const cliente = await obtenerClientePersistido(perro.clienteId);

  if (!cliente) {
    throw crearErrorServidor(
      "CLIENTE_NO_ENCONTRADO",
      "El cliente asociado al perro no existe.",
      404,
      { perroId: "El perro no tiene un cliente válido." },
    );
  }

  if (!cliente.activo) {
    throw crearErrorServidor(
      "RELACION_INVALIDA",
      "El cliente asociado al perro no está activo.",
      409,
      { perroId: "El cliente del perro se encuentra inactivo." },
    );
  }

  return { perro, cliente };
}

export function perroRelacionadoConGroomer(perro, citas, tareas, groomerId) {
  return citas.some(
    (cita) =>
      String(cita.perroId) === String(perro.id) &&
      tareas.some(
        (tarea) =>
          String(tarea.citaId) === String(cita.id) &&
          String(tarea.groomerId) === String(groomerId),
      ),
  );
}

export function clienteRelacionadoConGroomer(
  cliente,
  perros,
  citas,
  tareas,
  groomerId,
) {
  return perros.some(
    (perro) =>
      String(perro.clienteId) === String(cliente.id) &&
      perroRelacionadoConGroomer(perro, citas, tareas, groomerId),
  );
}

export async function cargarContextoGroomer() {
  const [citas, tareas] = await Promise.all([
    listarCitasPersistidas(),
    listarTareasPersistidas(),
  ]);

  return { citas, tareas };
}
