export default function ErrorMessage({ mensaje }) {
  if (!mensaje) {
    return null;
  }

  return (
    <div
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
    >
      {mensaje}
    </div>
  );
}
