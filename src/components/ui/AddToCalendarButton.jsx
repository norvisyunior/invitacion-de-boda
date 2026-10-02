import { useState } from 'react';
import { CalendarPlus } from 'lucide-react';
import Button from './Button.jsx';
import { createIcsFile, downloadIcs } from '../../utils/calendarUtils.js';
import { formatWeddingDateLabel, formatWeddingTimeLabel } from '../../utils/dateUtils.js';

/**
 * Botón para generar y descargar un evento de calendario (.ics).
 * `tone`: 'light' | 'dark' (cierre oliva).
 */
export default function AddToCalendarButton({ weddingData, tone = 'light' }) {
  const [status, setStatus] = useState('idle'); // idle | success | error
  const [message, setMessage] = useState('');
  const hintClass = tone === 'dark' ? 'text-sage/90' : 'text-charcoal/70';

  const { date, ceremony, couple } = weddingData;

  const handleAdd = () => {
    setStatus('idle');
    setMessage('');

    const startMs = Date.parse(date?.startsAt);
    if (!Number.isFinite(startMs)) {
      setStatus('error');
      setMessage('La fecha de la boda todavía no está configurada.');
      return;
    }

    const durationHours = Number(date?.durationHours) > 0 ? Number(date.durationHours) : 5;
    const endMs = startMs + durationHours * 60 * 60 * 1000;

    const summary = `Boda de ${couple.partnerA} y ${couple.partnerB}`;
    const location = ceremony?.enabled
      ? [ceremony.venueName, ceremony.address, ceremony.coordinatesLabel].filter(Boolean).join(' · ')
      : '';
    const description = [
      date.dateLabel || formatWeddingDateLabel(startMs, date.timezone),
      date.timeLabel || formatWeddingTimeLabel(startMs, date.timezone),
      location,
    ]
      .filter(Boolean)
      .join(' · ');

    const result = createIcsFile({
      summary,
      description,
      location,
      startMs,
      endMs,
    });

    if (!result.ok) {
      setStatus('error');
      setMessage(result.reason || 'No se pudo crear el evento.');
      return;
    }

    downloadIcs(result.content, result.filename);
    setStatus('success');
    setMessage('Evento descargado. Ábrelo para añadirlo a tu calendario.');
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        type="button"
        variant="secondary"
        onClick={handleAdd}
        className={
          tone === 'dark'
            ? 'border-champagne/45 bg-white/95 text-charcoal hover:border-champagne hover:bg-white'
            : undefined
        }
      >
        <CalendarPlus size={18} aria-hidden="true" />
        Añadir al calendario
      </Button>
      {message ? (
        <p
          className={
            tone === 'dark'
              ? 'min-h-[1.25rem] max-w-xs text-center text-xs text-sage/90'
              : `min-h-[1.25rem] text-center text-xs ${hintClass}`
          }
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      ) : (
        <span className="sr-only" role="status" aria-live="polite">
          {message}
        </span>
      )}
    </div>
  );
}
