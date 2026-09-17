export default function Loading({ mensaje = "Cargando..." }) {
  return (
    <div
      role="status"
      className="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800"
    >
      {mensaje}
    </div>
  );
}
