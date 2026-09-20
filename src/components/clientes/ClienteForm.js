"use client";

import { useState } from "react";

export const FORMULARIO_CLIENTE_INICIAL = {
  nombre: "",
  telefono: "",
  correo: "",
  observaciones: "",
};

function datosIniciales(cliente) {
  if (!cliente) {
    return { ...FORMULARIO_CLIENTE_INICIAL };
  }

  return {
    nombre: cliente.nombre || "",
    telefono: cliente.telefono || "",
    correo: cliente.correo || cliente.email || "",
    observaciones: cliente.observaciones || "",
  };
}

export default function ClienteForm({
  formulario,
  erroresCampos = {},
  guardando = false,
  textoAccion,
  onChange,
  onSubmit,
  onCancelar,
  onSubmitSuccess,
  clienteEditar = null,
}) {
  const esControlado = Boolean(formulario && onChange && onSubmit);
  const [interno, setInterno] = useState(() => datosIniciales(clienteEditar));
  const [errorLocal, setErrorLocal] = useState("");
  const [guardandoLocal, setGuardandoLocal] = useState(false);

  const valores = esControlado ? formulario : interno;
  const ocupado = esControlado ? guardando : guardandoLocal;
  const titulo = clienteEditar ? "Editar Cliente" : "Registrar Nuevo Cliente";
  const etiquetaBoton =
    textoAccion ||
    (clienteEditar ? "Actualizar Cliente" : "Guardar Cliente");

  function actualizarCampo(event) {
    const { name, value } = event.target;
    const siguiente = { ...valores, [name]: value };

    if (esControlado) {
      onChange(siguiente);
      return;
    }

    setInterno(siguiente);
  }

  async function manejarSubmit(event) {
    event.preventDefault();

    if (esControlado) {
      await onSubmit(event);
      return;
    }

    setErrorLocal("");

    if (!valores.nombre.trim() || !valores.telefono.trim()) {
      setErrorLocal("El nombre y el teléfono son campos obligatorios.");
      return;
    }

    try {
      setGuardandoLocal(true);
      if (onSubmitSuccess) {
        await onSubmitSuccess({
          nombre: valores.nombre,
          telefono: valores.telefono,
          correo: valores.correo,
          observaciones: valores.observaciones,
        });
      }
      setInterno({ ...FORMULARIO_CLIENTE_INICIAL });
    } catch (errorPeticion) {
      setErrorLocal(
        errorPeticion.mensaje || "Ocurrió un error al guardar el cliente.",
      );
    } finally {
      setGuardandoLocal(false);
    }
  }

  return (
    <form
      onSubmit={manejarSubmit}
      className="space-y-4 rounded-lg bg-white p-6 shadow-md"
    >
      <h2 className="text-xl font-bold text-gray-800">{titulo}</h2>

      {errorLocal ? (
        <div className="rounded border border-red-400 bg-red-100 px-4 py-2 text-red-700">
          {errorLocal}
        </div>
      ) : null}

      {erroresCampos.nombre || erroresCampos.telefono || erroresCampos.correo ? (
        <div className="rounded border border-red-400 bg-red-100 px-4 py-2 text-red-700">
          {erroresCampos.nombre ||
            erroresCampos.telefono ||
            erroresCampos.correo}
        </div>
      ) : null}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombre Completo *
        </label>
        <input
          type="text"
          name="nombre"
          value={valores.nombre}
          onChange={actualizarCampo}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Ej. Carlos Mendoza"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Teléfono *
        </label>
        <input
          type="text"
          name="telefono"
          value={valores.telefono}
          onChange={actualizarCampo}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Ej. 7788-9900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Correo Electrónico
        </label>
        <input
          type="email"
          name="correo"
          value={valores.correo}
          onChange={actualizarCampo}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="correo@ejemplo.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Observaciones
        </label>
        <textarea
          name="observaciones"
          value={valores.observaciones}
          onChange={actualizarCampo}
          rows="2"
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Notas generales del cliente"
        />
      </div>

      <button
        type="submit"
        disabled={ocupado}
        className="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition duration-200 hover:bg-blue-700 disabled:opacity-50"
      >
        {ocupado ? "Guardando..." : etiquetaBoton}
      </button>

      {onCancelar ? (
        <button
          type="button"
          onClick={onCancelar}
          className="w-full rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700"
        >
          Cancelar
        </button>
      ) : null}
    </form>
  );
}
