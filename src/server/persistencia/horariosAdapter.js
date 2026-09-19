import { solicitarMockApi } from "@/server/persistencia/mockApiClient";
import { DIAS_SEMANA } from "@/utils/tiempo";

const RECURSO_HORARIOS = "/horarios";

export function normalizarHorarioPersistido(horario) {
  if (!horario) {
    return null;
  }

  const diaSemana = String(horario.diaSemana ?? "").trim();

  return {
    id: horario.id,
    groomerId: String(horario.groomerId ?? "").trim(),
    diaSemana: DIAS_SEMANA.includes(diaSemana) ? diaSemana : diaSemana,
    horaInicio: String(horario.horaInicio ?? "").trim(),
    horaFin: String(horario.horaFin ?? "").trim(),
    activo: typeof horario.activo === "boolean" ? horario.activo : true,
  };
}

export async function listarHorariosPersistidos() {
  const horarios = await solicitarMockApi(RECURSO_HORARIOS);
  return Array.isArray(horarios)
    ? horarios.map(normalizarHorarioPersistido)
    : [];
}

export async function listarHorariosDeGroomer(groomerId) {
  const horarios = await listarHorariosPersistidos();
  return horarios.filter(
    (horario) => String(horario.groomerId) === String(groomerId),
  );
}

export async function obtenerHorarioPersistido(id) {
  const horario = await solicitarMockApi(
    `${RECURSO_HORARIOS}/${encodeURIComponent(id)}`,
  );
  return normalizarHorarioPersistido(horario);
}

export async function crearHorarioPersistido(horario) {
  const creado = await solicitarMockApi(RECURSO_HORARIOS, {
    method: "POST",
    body: JSON.stringify(horario),
  });
  return normalizarHorarioPersistido(creado);
}

export async function actualizarHorarioPersistido(id, cambios) {
  const horario = await obtenerHorarioPersistido(id);

  if (!horario) {
    return null;
  }

  const actualizado = await solicitarMockApi(
    `${RECURSO_HORARIOS}/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      body: JSON.stringify({
        id: horario.id,
        groomerId: cambios.groomerId ?? horario.groomerId,
        diaSemana: cambios.diaSemana ?? horario.diaSemana,
        horaInicio: cambios.horaInicio ?? horario.horaInicio,
        horaFin: cambios.horaFin ?? horario.horaFin,
        activo: horario.activo,
      }),
    },
  );

  return normalizarHorarioPersistido(actualizado);
}

export async function cambiarEstadoHorarioPersistido(id, activo) {
  const horario = await obtenerHorarioPersistido(id);

  if (!horario) {
    return null;
  }

  const actualizado = await solicitarMockApi(
    `${RECURSO_HORARIOS}/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      body: JSON.stringify({ ...horario, activo }),
    },
  );

  return normalizarHorarioPersistido(actualizado);
}
