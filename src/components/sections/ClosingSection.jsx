import BotanicalDecoration from '../layout/BotanicalDecoration.jsx';
import Button from '../ui/Button.jsx';
import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useReducedMotionPreference } from '../../hooks/useReducedMotionPreference.js';

function buildWhatsAppUrl({ enabled, phone, message }) {
  if (!enabled) return null;
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return null;
  const text = encodeURIComponent(message || 'Hola, escribe una consulta sobre la invitación.');
  return `https://wa.me/${digits}?text=${text}`;
}

/**
 * Cierre romántico de la invitación.
 */
export default function ClosingSection({ weddingData }) {
  const reduced = useReducedMotionPreference();
  const { couple, date, copy, whatsapp, assets } = weddingData;
  const waUrl = buildWhatsAppUrl(whatsapp);
  const logo = assets?.logo;

  return (
    <footer
      id="cierre"
      className="relative w-full overflow-hidden bg-olive-dark px-5 py-20 text-center text-ivory safe-pb"
    >
      <div className="pointer-events-none absolute left-0 top-8 w-24 opacity-30 sm:w-32">
        <BotanicalDecoration variant="corner-left" className="h-auto w-full" />
      </div>
      <div className="pointer-events-none absolute right-0 top-8 w-24 opacity-30 sm:w-32">
        <BotanicalDecoration variant="corner-right" className="h-auto w-full" />
      </div>

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center"
        initial={reduced ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        {logo ? (
          <img
            src={logo}
            alt=""
            className="mb-6 h-16 w-16 rounded-full object-cover ring-1 ring-champagne/40"
            width={64}
            height={64}
            loading="lazy"
            decoding="async"
          />
        ) : null}

        <BotanicalDecoration variant="divider" className="opacity-60 [&_line]:stroke-champagne/40" />

        <p className="mt-6 font-display text-[clamp(1.5rem,5vw,2.15rem)] italic leading-snug text-ivory">
          {copy.closingLine}
        </p>

        <p className="mt-8 font-display text-3xl tracking-wide text-champagne sm:text-4xl">
          {couple.partnerA} &amp; {couple.partnerB}
        </p>

        <p className="mt-3 text-sm uppercase tracking-[0.22em] text-sage/90">
          {date.dateLabel}
        </p>

        <div className="mt-10 flex w-full flex-col items-center gap-4">
          {waUrl ? (
            <Button
              as="a"
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              className="border-champagne/45 bg-white/95 text-charcoal hover:border-champagne hover:bg-white"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Consultar por WhatsApp
            </Button>
          ) : null}

          <p className="max-w-sm text-xs leading-relaxed text-sage/90">
            Gracias por formar parte de este día tan especial.
          </p>
        </div>
      </motion.div>
    </footer>
  );
}
