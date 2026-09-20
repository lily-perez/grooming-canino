import { listarCitasPersistidas } from "@/server/persistencia/citasAdapter";
import { listarServiciosPersistidos } from "@/server/persistencia/serviciosAdapter";
import { listarTareasPersistidas } from "@/server/persistencia/tareasAdapter";
import { listarUsuariosPersistidos } from "@/server/persistencia/usuariosAdapter";
import { rangoDelPeriodo } from "@/server/reglas/dashboard";
import { crearErrorServidor } from "@/server/respuestas";

export const PERIODOS_REPORTES = ["semana", "mes"];

const DIAS_SEMANA = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

const METRICA_SIN_DATOS = {
  id: "",
  nombre: "Sin datos",
  cantidad: 0,
};

function idTexto(valor) {
  if (valor === undefined || valor === null) {
    return "";
  }

  return String(valor).trim();
}

function fechaValida(fecha) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(fecha || ""));
}

function partesFecha(fecha) {
  const [anio, mes, dia] = String(fecha).split("-").map(Number);
  return { anio, mes, dia };
}

function sumarDias(fecha, dias) {
  const { anio, mes, dia } = partesFecha(fecha);
  const utc = new Date(Date.UTC(anio, mes - 1, dia + dias));
  return utc.toISOString().slice(0, 10);
}

function nombreDia(fecha) {
  const { anio, mes, dia } = partesFecha(fecha);
  const utc = new Date(Date.UTC(anio, mes - 1, dia));
  return DIAS_SEMANA[utc.getUTCDay()] || "";
}

function fechaEnRango(fecha, inicio, fin) {
  return fechaValida(fecha) && fecha >= inicio && fecha <= fin;
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

function diasDelRango(inicio, fin) {
  let cantidad = 0;

  for (let fecha = inicio; fecha <= fin; fecha = sumarDias(fecha, 1)) {
    cantidad += 1;
  }

  return cantidad;
}

function promedioCitasDiarias(totalCitas, dias) {
  if (!dias || totalCitas <= 0) {
    return 0;
  }

  return Number((totalCitas / dias).toFixed(1));
}

function servicioMasSolicitado(citas, servicios) {
  const catalogo = indicePorId(servicios);
  const conteo = new Map();

  for (const cita of citas) {
    for (const servicioId of cita.servicioIds || []) {
      const id = idTexto(servicioId);
      const servicio = catalogo.get(id);

      if (!id || !servicio?.nombre) {
        continue;
      }

      const actual = conteo.get(id) || {
        id,
        nombre: servicio.nombre,
        cantidad: 0,
      };
      actual.cantidad += 1;
      conteo.set(id, actual);
    }
  }

  const ranking = [...conteo.values()].sort(
    (a, b) => b.cantidad - a.cantidad || a.nombre.localeCompare(b.nombre, "es"),
  );

  return ranking[0] || { ...METRICA_SIN_DATOS };
}

function groomerMasAtenciones(citas, tareas, usuarios) {
  const idsCitas = new Set(
    citas.map((cita) => idTexto(cita.id)).filter(Boolean),
  );
  const groomers = indicePorId(
    usuarios.filter((usuario) => usuario?.rol === "groomer"),
  );
  const conteo = new Map();

  for (const tarea of tareas) {
    const citaId = idTexto(tarea?.citaId);
    const groomerId = idTexto(tarea?.groomerId);
    const groomer = groomers.get(groomerId);

    if (
      !citaId ||
      !groomerId ||
      !idsCitas.has(citaId) ||
      tarea.estado !== "completada" ||
      !groomer?.nombre
    ) {
      continue;
    }

    const actual = conteo.get(groomerId) || {
      id: groomerId,
      nombre: groomer.nombre,
      cantidad: 0,
    };
    actual.cantidad += 1;
    conteo.set(groomerId, actual);
  }

  const ranking = [...conteo.values()].sort(
    (a, b) => b.cantidad - a.cantidad || a.nombre.localeCompare(b.nombre, "es"),
  );

  return ranking[0] || { ...METRICA_SIN_DATOS };
}

function citasPorDia(citas, inicio, fin) {
  const filas = [];

  for (let fecha = inicio; fecha <= fin; fecha = sumarDias(fecha, 1)) {
    const delDia = citas.filter((cita) => cita.fecha === fecha);
    filas.push({
      fecha,
      dia: nombreDia(fecha),
      total: delDia.length,
      completadas: delDia.filter((cita) => cita.estado === "completada").length,
      canceladas: delDia.filter((cita) => cita.estado === "cancelada").length,
    });
  }

  return filas;
}

export function normalizarPeriodoReportes(valor) {
  const periodo = String(valor || "semana").trim().toLowerCase();

  if (!PERIODOS_REPORTES.includes(periodo)) {
    throw crearErrorServidor(
      "DATOS_INVALIDOS",
      "El período indicado no es válido.",
      400,
      { periodo: "Usa semana o mes." },
    );
  }

  return periodo;
}

export async function calcularResumenReportes(periodoSolicitado) {
  const periodo = normalizarPeriodoReportes(periodoSolicitado);
  const { inicio, fin } = rangoDelPeriodo(periodo);
  const [citasCrudas, tareasCrudas, serviciosCrudos, usuariosCrudos] =
    await Promise.all([
      listarCitasPersistidas(),
      listarTareasPersistidas(),
      listarServiciosPersistidos(),
      listarUsuariosPersistidos(),
    ]);

  const citas = citasCrudas.filter(Boolean);
  const tareas = tareasCrudas.filter(Boolean);
  const servicios = serviciosCrudos.filter(Boolean);
  const usuarios = usuariosCrudos.filter(Boolean);
  const citasPeriodo = citas.filter((cita) =>
    fechaEnRango(cita.fecha, inicio, fin),
  );

  return {
    periodo,
    rango: { inicio, fin },
    metricas: {
      promedioCitasDiarias: promedioCitasDiarias(
        citasPeriodo.length,
        diasDelRango(inicio, fin),
      ),
      servicioMasSolicitado: servicioMasSolicitado(citasPeriodo, servicios),
      groomerMasAtenciones: groomerMasAtenciones(
        citasPeriodo,
        tareas,
        usuarios,
      ),
    },
    citasPorDia: citasPorDia(citasPeriodo, inicio, fin),
  };
}
