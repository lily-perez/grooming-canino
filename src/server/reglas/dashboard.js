import { listarCitasPersistidas } from "@/server/persistencia/citasAdapter";
import { listarClientesPersistidos } from "@/server/persistencia/clientesAdapter";
import { listarRegistrosAtencionPersistidos } from "@/server/persistencia/historialAdapter";
import { listarPerrosPersistidos } from "@/server/persistencia/perrosAdapter";
import { listarServiciosPersistidos } from "@/server/persistencia/serviciosAdapter";
import { listarTareasPersistidas } from "@/server/persistencia/tareasAdapter";
import { crearErrorServidor } from "@/server/respuestas";
import { esHoraValida } from "@/utils/tiempo";

const ZONA_HORARIA = "America/Guatemala";
export const PERIODOS_DASHBOARD = ["hoy", "semana", "mes"];
const LIMITE_RANKING = 5;
const LIMITE_LISTAS = 8;

function fechaHoyServidor() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONA_HORARIA,
  }).format(new Date());
}

function partesFecha(fecha) {
  const [anio, mes, dia] = String(fecha).split("-").map(Number);
  return { anio, mes, dia };
}

function fechaValida(fecha) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(fecha || ""));
}

function diaSemanaLunesCero(fecha) {
  const { anio, mes, dia } = partesFecha(fecha);
  const utc = new Date(Date.UTC(anio, mes - 1, dia));
  const diaUtc = utc.getUTCDay();
  return diaUtc === 0 ? 6 : diaUtc - 1;
}

function sumarDias(fecha, dias) {
  const { anio, mes, dia } = partesFecha(fecha);
  const utc = new Date(Date.UTC(anio, mes - 1, dia + dias));
  return utc.toISOString().slice(0, 10);
}

export function rangoDelPeriodo(periodo, hoy = fechaHoyServidor()) {
  if (periodo === "hoy") {
    return { inicio: hoy, fin: hoy };
  }

  if (periodo === "semana") {
    const inicio = sumarDias(hoy, -diaSemanaLunesCero(hoy));
    return { inicio, fin: sumarDias(inicio, 6) };
  }

  const { anio, mes } = partesFecha(hoy);
  const inicio = `${anio}-${String(mes).padStart(2, "0")}-01`;
  const ultimoDia = new Date(Date.UTC(anio, mes, 0)).getUTCDate();
  const fin = `${anio}-${String(mes).padStart(2, "0")}-${String(ultimoDia).padStart(2, "0")}`;
  return { inicio, fin };
}

function fechaEnRango(fecha, inicio, fin) {
  return fechaValida(fecha) && fecha >= inicio && fecha <= fin;
}

function idTexto(valor) {
  if (valor === undefined || valor === null) {
    return "";
  }

  return String(valor).trim();
}

function deduplicarPorClave(items, obtenerClave) {
  const vistos = new Set();
  const unicos = [];

  for (const item of items) {
    const clave = obtenerClave(item);

    if (!clave || vistos.has(clave)) {
      continue;
    }

    vistos.add(clave);
    unicos.push(item);
  }

  return unicos;
}

function idCita(cita) {
  const id = idTexto(cita?.id);

  if (id) {
    return id;
  }

  const fecha = idTexto(cita?.fecha);
  const horaInicio = idTexto(cita?.horaInicio);
  const perroId = idTexto(cita?.perroId);

  if (!fecha && !horaInicio && !perroId) {
    return "";
  }

  return [fecha, horaInicio, perroId].join("|");
}

function idHistorial(registro) {
  const id = idTexto(registro?.id);

  if (id) {
    return id;
  }

  const citaId = idTexto(registro?.citaId);
  const perroId = idTexto(registro?.perroId);
  const fecha = idTexto(registro?.fecha);

  if (!citaId && !perroId && !fecha) {
    return "";
  }

  return [citaId, perroId, fecha].join("|");
}

function claveActividad(tipo, citaId, historialId) {
  return `${tipo}:${citaId}:${historialId}`;
}

function indicePorId(items) {
  const mapa = new Map();

  for (const item of items) {
    const id = idTexto(item?.id);

    if (!id) {
      continue;
    }

    mapa.set(id, item);
  }

  return mapa;
}

function citasEnRango(citas, inicio, fin) {
  return citas.filter((cita) => fechaEnRango(cita.fecha, inicio, fin));
}

function contarPorEstado(citas) {
  return {
    programadas: citas.filter((cita) => cita.estado === "programada").length,
    enProceso: citas.filter((cita) => cita.estado === "en_proceso").length,
    completadas: citas.filter((cita) => cita.estado === "completada").length,
    canceladas: citas.filter((cita) => cita.estado === "cancelada").length,
  };
}

function rankingServicios(citas, servicios) {
  const nombres = indicePorId(servicios);
  const conteo = new Map();

  for (const cita of citas) {
    for (const servicioId of cita.servicioIds || []) {
      const id = idTexto(servicioId);

      if (!id) {
        continue;
      }

      conteo.set(id, (conteo.get(id) || 0) + 1);
    }
  }

  return [...conteo.entries()]
    .map(([id, cantidad]) => ({
      id,
      nombre: nombres.get(id)?.nombre || `Servicio ${id}`,
      cantidad,
    }))
    .sort((a, b) => b.cantidad - a.cantidad || a.nombre.localeCompare(b.nombre))
    .slice(0, LIMITE_RANKING);
}

function rankingClientes(citas, perros, clientes) {
  const perrosPorId = indicePorId(perros);
  const clientesPorId = indicePorId(clientes);
  const conteo = new Map();

  for (const cita of citas) {
    const perro = perrosPorId.get(idTexto(cita.perroId));

    if (!perro) {
      continue;
    }

    const cliente = clientesPorId.get(idTexto(perro.clienteId));
    const id = idTexto(cliente?.id);

    if (!cliente || !id) {
      continue;
    }

    const actual = conteo.get(id) || { id, nombre: cliente.nombre, cantidad: 0 };
    actual.cantidad += 1;
    conteo.set(id, actual);
  }

  return [...conteo.values()]
    .sort((a, b) => b.cantidad - a.cantidad || a.nombre.localeCompare(b.nombre))
    .slice(0, LIMITE_RANKING);
}

function formatearHorarioCita(cita) {
  const horaInicio = esHoraValida(cita.horaInicio) ? cita.horaInicio : "";
  const horaFinEstimada = esHoraValida(cita.horaFinEstimada)
    ? cita.horaFinEstimada
    : "";

  if (horaInicio && horaFinEstimada) {
    return `${horaInicio} - ${horaFinEstimada}`;
  }

  return horaInicio || horaFinEstimada || "Horario no disponible";
}

function resolverNombres(cita, perrosPorId, clientesPorId) {
  const perro = perrosPorId.get(idTexto(cita.perroId));
  const cliente = perro
    ? clientesPorId.get(idTexto(perro.clienteId))
    : null;

  return {
    perroNombre: perro?.nombre || "Perro no disponible",
    clienteNombre: cliente?.nombre || "Cliente no disponible",
  };
}

function citasPorDia(citas, inicio, fin) {
  const conteo = new Map();

  for (let fecha = inicio; fecha <= fin; fecha = sumarDias(fecha, 1)) {
    conteo.set(fecha, 0);
  }

  for (const cita of citas) {
    if (conteo.has(cita.fecha)) {
      conteo.set(cita.fecha, conteo.get(cita.fecha) + 1);
    }
  }

  return [...conteo.entries()].map(([fecha, cantidad]) => ({ fecha, cantidad }));
}

function actividadReciente(citasPeriodo, registros, perrosPorId, clientesPorId) {
  const accionesCita = {
    programada: "Cita programada",
    en_proceso: "Cita en proceso",
    completada: "Cita completada",
    cancelada: "Cita cancelada",
  };

  const desdeCitas = citasPeriodo
    .map((cita) => {
      if (!cita) {
        return null;
      }

      const citaId = idCita(cita);

      if (!citaId) {
        return null;
      }

      return {
        tipo: "cita",
        citaId,
        historialId: "",
        fecha: cita.fecha,
        hora: cita.horaInicio || "",
        estado: cita.estado,
        accion: accionesCita[cita.estado] || "Cita",
        ...resolverNombres(cita, perrosPorId, clientesPorId),
      };
    })
    .filter(Boolean);

  const desdeHistorial = registros
    .map((registro) => {
      if (!registro) {
        return null;
      }

      const historialId = idHistorial(registro);
      const citaId = idTexto(registro.citaId);
      const perro = perrosPorId.get(idTexto(registro.perroId));
      const cliente = perro
        ? clientesPorId.get(idTexto(perro.clienteId))
        : null;

      if (!historialId) {
        return null;
      }

      return {
        tipo: "historial",
        citaId,
        historialId,
        fecha: registro.fecha,
        hora: "",
        estado: "completada",
        accion: "Registro de atención",
        perroNombre: perro?.nombre || "Perro no disponible",
        clienteNombre: cliente?.nombre || "Cliente no disponible",
      };
    })
    .filter(Boolean);

  return deduplicarPorClave(
    [...desdeCitas, ...desdeHistorial].sort((a, b) => {
      const porFecha = String(b.fecha).localeCompare(String(a.fecha));
      if (porFecha !== 0) {
        return porFecha;
      }
      return String(b.hora).localeCompare(String(a.hora));
    }),
    (item) => claveActividad(item.tipo, item.citaId, item.historialId),
  ).slice(0, LIMITE_LISTAS);
}

function proximasCitas(citas, hoy, perrosPorId, clientesPorId) {
  const proximas = citas
    .filter(
      (cita) =>
        cita &&
        fechaValida(cita.fecha) &&
        cita.fecha >= hoy &&
        (cita.estado === "programada" || cita.estado === "en_proceso"),
    )
    .sort((a, b) => {
      const porFecha = String(a.fecha).localeCompare(String(b.fecha));
      if (porFecha !== 0) {
        return porFecha;
      }
      return String(a.horaInicio).localeCompare(String(b.horaInicio));
    })
    .slice(0, LIMITE_LISTAS)
    .map((cita) => {
      const id = idCita(cita);

      if (!id) {
        return null;
      }

      return {
        id,
        fecha: cita.fecha,
        horario: formatearHorarioCita(cita),
        estado: cita.estado,
        ...resolverNombres(cita, perrosPorId, clientesPorId),
      };
    })
    .filter(Boolean);

  return deduplicarPorClave(proximas, (cita) => cita.id);
}

export function normalizarPeriodoDashboard(valor) {
  const periodo = String(valor || "mes").trim().toLowerCase();

  if (!PERIODOS_DASHBOARD.includes(periodo)) {
    throw crearErrorServidor(
      "DATOS_INVALIDOS",
      "El período indicado no es válido.",
      400,
      { periodo: "Usa hoy, semana o mes." },
    );
  }

  return periodo;
}

export async function calcularResumenDashboard(periodoSolicitado) {
  const periodo = normalizarPeriodoDashboard(periodoSolicitado);
  const hoy = fechaHoyServidor();
  const { inicio, fin } = rangoDelPeriodo(periodo, hoy);
  const inicioSemana = rangoDelPeriodo("semana", hoy);
  const inicioMes = rangoDelPeriodo("mes", hoy);

  const [citasCrudas, tareasCrudas, serviciosCrudos, clientesCrudos, perrosCrudos, registrosCrudos] =
    await Promise.all([
      listarCitasPersistidas(),
      listarTareasPersistidas(),
      listarServiciosPersistidos(),
      listarClientesPersistidos(),
      listarPerrosPersistidos(),
      listarRegistrosAtencionPersistidos(),
    ]);

  const citas = citasCrudas.filter(Boolean);
  const tareas = tareasCrudas.filter(Boolean);
  const servicios = serviciosCrudos.filter(Boolean);
  const clientes = clientesCrudos.filter(Boolean);
  const perros = perrosCrudos.filter(Boolean);
  const registros = registrosCrudos.filter(Boolean);

  const citasHoy = citasEnRango(citas, hoy, hoy);
  const citasSemana = citasEnRango(citas, inicioSemana.inicio, inicioSemana.fin);
  const citasMes = citasEnRango(citas, inicioMes.inicio, inicioMes.fin);
  const citasPeriodo = citasEnRango(citas, inicio, fin);
  const registrosPeriodo = registros.filter((registro) =>
    fechaEnRango(registro.fecha, inicio, fin),
  );
  const estados = contarPorEstado(citasPeriodo);
  const perrosPorId = indicePorId(perros);
  const clientesPorId = indicePorId(clientes);

  return {
    periodo,
    rango: { inicio, fin },
    metricas: {
      citasHoy: citasHoy.length,
      citasSemana: citasSemana.length,
      citasMes: citasMes.length,
      programadas: estados.programadas,
      enProceso: estados.enProceso,
      completadas: estados.completadas,
      canceladas: estados.canceladas,
      tareasActivas: tareas.filter(
        (tarea) =>
          tarea.estado === "pendiente" || tarea.estado === "en_proceso",
      ).length,
    },
    serviciosMasSolicitados: rankingServicios(citasPeriodo, servicios),
    clientesMasFrecuentes: rankingClientes(citasPeriodo, perros, clientes),
    citasPorDia: citasPorDia(citasPeriodo, inicio, fin),
    proximasCitas: proximasCitas(citas, hoy, perrosPorId, clientesPorId),
    actividadReciente: actividadReciente(
      citasPeriodo,
      registrosPeriodo,
      perrosPorId,
      clientesPorId,
    ),
  };
}
