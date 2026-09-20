"use client";

import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";

export const FORMULARIO_CLIENTE_INICIAL = {
  nombre: "",
  telefono: "",
  correo: "",
  observaciones: "",
};

export default function ClienteForm({
  formulario,
  erroresCampos = {},
  guardando = false,
  textoAccion = "Guardar",
  onChange,
  onSubmit,
  onCancelar,
}) {
  function actualizarCampo(event) {
    const { name, value } = event.target;
    onChange({ ...formulario, [name]: value });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        label="Nombre"
        name="nombre"
        value={formulario.nombre}
        onChange={actualizarCampo}
        error={erroresCampos.nombre}
      />
      <Input
        label="Teléfono"
        name="telefono"
        value={formulario.telefono}
        onChange={actualizarCampo}
        error={erroresCampos.telefono}
      />
      <Input
        label="Correo"
        name="correo"
        type="email"
        value={formulario.correo}
        onChange={actualizarCampo}
        error={erroresCampos.correo}
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
