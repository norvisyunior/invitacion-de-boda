import SectionContainer from '../layout/SectionContainer.jsx';
import SectionHeading from '../layout/SectionHeading.jsx';
import CountdownUnit from '../ui/CountdownUnit.jsx';
import { useCountdown } from '../../hooks/useCountdown.js';
import { parseWeddingDate } from '../../utils/dateUtils.js';
import { useReducedMotionPreference } from '../../hooks/useReducedMotionPreference.js';
import { motion } from 'motion/react';

/**
 * Cuenta atrás en tiempo real hasta la boda.
 */
export default function CountdownSection({ weddingData }) {
  const reduced = useReducedMotionPreference();
  const { date, countdown } = weddingData;

  if (!countdown?.enabled) return null;

  const targetMs = parseWeddingDate(date?.startsAt);
  const { days, hours, minutes, seconds, isPast } = useCountdown(targetMs);

  return (
    <SectionContainer id="cuenta-atras" tone="sage">
      <SectionHeading eyebrow="Espera" title={countdown.title || 'Cuenta atrás'} />

      {isPast ? (
        <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-border bg-white/70 px-6 py-10 text-center">
          <p className="font-display text-2xl leading-snug text-charcoal">
            {countdown.pastMessage}
          </p>
        </div>
      ) : (
        <>
          <div
            className="countdown-grid mx-auto mt-10 w-full max-w-xl"
            role="timer"
            aria-live="off"
            aria-atomic="true"
            aria-label="Tiempo restante hasta la boda"
          >
            <CountdownUnit value={days} label="Días" />
            <CountdownUnit value={hours} label="Horas" />
            <CountdownUnit value={minutes} label="Minutos" />
            <CountdownUnit value={seconds} label="Segundos" />
          </div>

          <motion.p
            className="mx-auto mt-8 max-w-md text-center text-sm leading-relaxed text-charcoal/75"
            initial={reduced ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {days > 1
              ? `Faltan ${days} días para el gran día. Gracias por ser parte de nuestra historia.`
              : days === 1
                ? 'Mañana celebramos nuestro enlace. Gracias por acompañarnos.'
                : 'Hoy es el día. Gracias por acompañarnos en esta celebración.'}
          </motion.p>
        </>
      )}
    </SectionContainer>
  );
}
