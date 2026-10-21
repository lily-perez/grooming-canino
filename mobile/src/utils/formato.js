export const ESTADOS = {
  PENDIENTE: 'pendiente',
  EN_PROCESO: 'en_proceso',
  COMPLETADA: 'completada',
};

export const ETIQUETA_ESTADO = {
  pendiente: 'Pendiente',
  en_proceso: 'En proceso',
  completada: 'Completada',
  programada: 'Programada',
  cancelada: 'Cancelada',
};

const MESES = [
  'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
  'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC',
];

// '2026-10-16' -> '16 OCT 2026'
export function formatearFecha(iso) {
  const [anio, mes, dia] = String(iso ?? '').split('-');

  if (!anio || !mes || !dia || !MESES[Number(mes) - 1]) {
    return iso || 'Sin fecha';
  }

  return `${dia} ${MESES[Number(mes) - 1]} ${anio}`;
}

export function nombreCompleto(persona) {
  if (!persona) {
    return '';
  }

  return (
    persona.nombreCompleto ||
    [persona.nombre, persona.apellido].filter(Boolean).join(' ')
  );
}