export default function EmptyState({
  mensaje = "No hay información disponible.",
}) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600">
      {mensaje}
    </div>
  );
}
