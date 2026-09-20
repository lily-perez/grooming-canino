import GestionHorarios from "@/components/groomers/GestionHorarios";

export default function AdminGroomersPage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
          Groomers
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Horarios y disponibilidad
        </h1>
        <p className="mt-2 text-slate-600">
          Configura el horario laboral de cada Groomer. La disponibilidad se
          calcula; no se almacena como entidad.
        </p>
      </div>
      <GestionHorarios />
    </section>
  );
}
