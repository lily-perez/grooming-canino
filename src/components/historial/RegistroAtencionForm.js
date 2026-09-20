"use client";

export const CAMPOS_OBSERVACION_UI = [
  { name: "ojos", label: "Ojos" },
  { name: "oidos", label: "Oídos" },
  { name: "dientes", label: "Dientes" },
  { name: "pelaje", label: "Pelaje" },
  { name: "comportamiento", label: "Comportamiento" },
  { name: "unas", label: "Uñas" },
  { name: "puntualidad", label: "Puntualidad" },
  { name: "observaciones", label: "Observaciones" },
];

export const FORMULARIO_OBSERVACION_INICIAL = CAMPOS_OBSERVACION_UI.reduce(
  (acumulado, campo) => {
    acumulado[campo.name] = "";
    return acumulado;
  },
  {},
);

export function observacionesDesdeRegistro(registro) {
  const formulario = { ...FORMULARIO_OBSERVACION_INICIAL };

  if (!registro) {
    return formulario;
  }

  for (const campo of CAMPOS_OBSERVACION_UI) {
    formulario[campo.name] = registro[campo.name] || "";
  }

  return formulario;
}

export default function RegistroAtencionForm({
  formulario,
  erroresCampos = {},
  guardando = false,
  textoAccion = "Guardar registro",
  onChange,
  onSubmit,
  onCancel,
}) {
  function manejarCambio(event) {
    const { name, value } = event.target;
    onChange({ ...formulario, [name]: value });
  }

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      {CAMPOS_OBSERVACION_UI.map((campo) => (
        <div key={campo.name}>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            {campo.label}
          </label>
          {campo.name === "observaciones" ? (
            <textarea
              name={campo.name}
              value={formulario[campo.name]}
              onChange={manejarCambio}
              rows="3"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500"
            />
          ) : (
            <input
              type="text"
              name={campo.name}
              value={formulario[campo.name]}
              onChange={manejarCambio}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500"
            />
          )}
          {erroresCampos[campo.name] ? (
            <p className="mt-1 text-sm text-red-600">{erroresCampos[campo.name]}</p>
          ) : null}
        </div>
      ))}
      <p className="text-xs text-slate-500">Todos los campos son opcionales.</p>
      <div className="flex gap-2">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
          >
            Cancelar
          </button>
        ) : null}
        <button
          type="submit"
          disabled={guardando}
          className="w-full rounded-lg bg-sky-700 px-4 py-2 font-semibold text-white hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {guardando ? "Guardando..." : textoAccion}
        </button>
      </div>
    </form>
  );
}
