/** Utilidades de fecha y cuenta atrás. */

/**
 * Calcula el tiempo restante hasta un instante futuro.
 * @param {number} targetMs - Marca de tiempo objetivo en ms.
 * @returns {{ total: number, days: number, hours: number, minutes: number, seconds: number, isPast: boolean }}
 */
export function getRemainingTime(targetMs) {
  const now = Date.now();
  const total = Math.max(0, targetMs - now);
  const totalSeconds = Math.floor(total / 1000);
  return {
    total,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isPast: targetMs <= now,
  };
}

/**
 * Convierte un ISO con desplazamiento a timestamp.
 * Devuelve null si la fecha no es válida.
 */
export function parseWeddingDate(isoWithOffset) {
  if (!isoWithOffset || typeof isoWithOffset !== 'string') return null;
  const ms = Date.parse(isoWithOffset);
  return Number.isFinite(ms) ? ms : null;
}

/**
 * Fecha local legible usando la zona horaria configurada.
 */
export function formatInTimezone(ms, timezone, options) {
  try {
    return new Intl.DateTimeFormat('es-ES', {
      timeZone: timezone || undefined,
      ...options,
    }).format(new Date(ms));
  } catch {
    return new Intl.DateTimeFormat('es-ES', options).format(new Date(ms));
  }
}

/**
 * Etiqueta larga de la fecha de la boda.
 */
export function formatWeddingDateLabel(ms, timezone) {
  return formatInTimezone(ms, timezone, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Etiqueta corta de la hora local (formato 12 h con AM/PM).
 */
export function formatWeddingTimeLabel(ms, timezone) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone || undefined,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(ms));
  } catch {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(ms));
  }
}

/**
 * Devuelve ceros a la izquierda para el contador.
 */
export function padNumber(value) {
  return String(value).padStart(2, '0');
}
