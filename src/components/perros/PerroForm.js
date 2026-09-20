"use client";

import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";

export const FORMULARIO_PERRO_INICIAL = {
  clienteId: "",
  nombre: "",
  raza: "",
  sexo: "",
  fechaNacimiento: "",
  observaciones: "",
};

const SEXOS = ["macho", "hembra"];

export default function PerroForm({
  formulario,
  clientes = [],
  erroresCampos = {},
  guardando = false,
  textoAccion = "Guardar",
  bloquearCliente = false,
  onChange,
  onSubmit,
  onCancelar,
}) {
  function actualizarCampo(event) {
    const { name, value } = event.target;
    onChange({ ...formulario, [name]: value });
  }

  const sexoOpciones = SEXOS.includes(formulario.sexo)
    ? SEXOS
    : formulario.sexo
      ? [formulario.sexo, ...SEXOS]
      : SEXOS;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="clienteId" className="block text-sm font-medium text-slate-700">
          Cliente
        </label>
        <select
          id="clienteId"
          name="clienteId"
          value={formulario.clienteId}
          onChange={actualizarCampo}
          disabled={bloquearCliente}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        >
          <option value="">Selecciona un cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre}
              {cliente.activo ? "" : " (inactivo)"}
            </option>
          ))}
        </select>
        {erroresCampos.clienteId ? (
          <p className="text-sm text-red-700">{erroresCampos.clienteId}</p>
        ) : null}
      </div>

      <Input
        label="Nombre"
        name="nombre"
        value={formulario.nombre}
        onChange={actualizarCampo}
        error={erroresCampos.nombre}
      />
      <Input
        label="Raza"
        name="raza"
        value={formulario.raza}
        onChange={actualizarCampo}
        error={erroresCampos.raza}
      />

      <div className="space-y-1">
        <label htmlFor="sexo" className="block text-sm font-medium text-slate-700">
          Sexo
        </label>
        <select
          id="sexo"
          name="sexo"
          value={formulario.sexo}
          onChange={actualizarCampo}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        >
          <option value="">Sin especificar</option>
          {sexoOpciones.map((sexo) => (
            <option key={sexo} value={sexo}>
              {sexo}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Fecha de nacimiento"
        name="fechaNacimiento"
        type="date"
        value={formulario.fechaNacimiento}
        onChange={actualizarCampo}
        error={erroresCampos.fechaNacimiento}
      />

      <div className="space-y-1">
        <label
          htmlFor="observaciones"
          className="block text-sm font-medium text-slate-700"
        >
          Observaciones
        </label>
        <textarea
          id="observaciones"
          name="observaciones"
          rows="3"
          value={formulario.observaciones}
          onChange={actualizarCampo}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={guardando}>
          {guardando ? "Guardando..." : textoAccion}
        </Button>
        {onCancelar ? (
          <button
            type="button"
            onClick={onCancelar}
            className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700"
          >
            Cancelar
          </button>
        ) : null}
      </div>
    </form>
  );
}
