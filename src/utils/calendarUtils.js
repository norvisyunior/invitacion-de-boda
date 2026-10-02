/** Generación de archivos .ics para añadir el evento al calendario. */

function toIcsDate(ms) {
  const d = new Date(ms);
  const pad = (n) => String(n).padStart(2, '0');
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

function escapeIcsText(value) {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

/**
 * Genera un archivo .ics válido en memoria.
 * @param {{ summary: string, description?: string, location?: string, startMs: number, endMs: number }} event
 * @returns {{ ok: true, filename: string, content: string } | { ok: false, reason: string }}
 */
export function createIcsFile({ summary, description, location, startMs, endMs }) {
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) {
    return { ok: false, reason: 'Fechas inválidas para el calendario.' };
  }
  if (!summary || !String(summary).trim()) {
    return { ok: false, reason: 'Falta el título del evento.' };
  }

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Invitacion Boda Botanica//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${startMs}-${Math.random().toString(36).slice(2, 10)}@wedding-invitation`,
    `DTSTAMP:${toIcsDate(Date.now())}`,
    `DTSTART:${toIcsDate(startMs)}`,
    `DTEND:${toIcsDate(endMs)}`,
    `SUMMARY:${escapeIcsText(summary)}`,
  ];

  if (description && String(description).trim()) {
    lines.push(`DESCRIPTION:${escapeIcsText(description)}`);
  }
  if (location && String(location).trim()) {
    lines.push(`LOCATION:${escapeIcsText(location)}`);
  }

  lines.push('END:VEVENT', 'END:VCALENDAR', '');

  return {
    ok: true,
    filename: 'boda.ics',
    content: lines.join('\r\n'),
  };
}

/**
 * Descarga el .ics en el navegador.
 */
export function downloadIcs(content, filename = 'boda.ics') {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
