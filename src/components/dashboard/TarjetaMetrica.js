export default function TarjetaMetrica({ titulo, valor, acento = "border-blue-500" }) {
  return (
    <div className={`bg-white p-4 rounded-lg shadow border-l-4 ${acento}`}>
      <p className="text-gray-500 text-sm font-medium">{titulo}</p>
      <p className="text-3xl font-bold text-gray-800">{valor}</p>
    </div>
  );
}
