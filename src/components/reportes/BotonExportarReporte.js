"use client";

export default function BotonExportarReporte() {
  function imprimir() {
    window.print();
  }

  return (
    <button
      type="button"
      onClick={imprimir}
      className="no-imprimir bg-sky-700 hover:bg-sky-800 text-white px-4 py-2 rounded-lg text-sm transition font-medium"
    >
      Exportar PDF
    </button>
  );
}
