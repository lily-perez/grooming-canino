import { listarCitasPersistidas } from "@/server/persistencia/citasAdapter";
import { listarHorariosPersistidos } from "@/server/persistencia/horariosAdapter";
import { listarTareasPersistidas } from "@/server/persistencia/tareasAdapter";
import {
  listarUsuariosPersistidos,
  sanitizarUsuario,
} from "@/server/persistencia/usuariosAdapter";
import {
  diaSemanaDeFecha,
  intervaloDentroDeHorario,
} from "@/utils/tiempo";
import { haySolapamientoTareaEnFecha } from "@/utils/validacionesServiciosTareas";

export function groomerCubreHorarioLaboral(
  horarios,
  groomerId,
  fecha,
  horaInicio,
  horaFin,
) {
  const diaSemana = diaSemanaDeFecha(fecha);

  return horarios.some(
    (horario) =>
      horario.activo &&
      String(horario.groomerId) === String(groomerId) &&
      horario.diaSemana === diaSemana &&
      intervaloDentroDeHorario(
        horaInicio,
        horaFin,
        horario.horaInicio,
        horario.horaFin,
      ),
  );
}

export async function listarGroomersDisponibles({
  fecha,
  horaInicio,
  horaFin,
  excluirTareaId = null,
}) {
  const [usuarios, horarios, tareas, citas] = await Promise.all([
    listarUsuariosPersistidos(),
    listarHorariosPersistidos(),
    listarTareasPersistidas(),
    listarCitasPersistidas(),
  ]);

  return usuarios
    .filter((usuario) => usuario.rol === "groomer" && usuario.activo === true)
    .filter((groomer) =>
      groomerCubreHorarioLaboral(
        horarios,
        groomer.id,
        fecha,
        horaInicio,
        horaFin,
      ),
    )
    .filter(
      (groomer) =>
        !haySolapamientoTareaEnFecha(
          tareas,
          citas,
          {
            groomerId: groomer.id,
            fecha,
            horaInicio,
            horaFin,
          },
          excluirTareaId,
        ),
    )
    .map(sanitizarUsuario);
}

export async function validarDisponibilidadGroomer(
  groomerId,
  fecha,
  horaInicio,
  horaFin,
  excluirTareaId = null,
) {
  const disponibles = await listarGroomersDisponibles({
    fecha,
    horaInicio,
    horaFin,
    excluirTareaId,
  });

  return disponibles.some(
    (groomer) => String(groomer.id) === String(groomerId),
  );
}
