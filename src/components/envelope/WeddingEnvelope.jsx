import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Hand } from 'lucide-react';
import EnvelopeFlap from './EnvelopeFlap.jsx';
import BotanicalDecoration from '../layout/BotanicalDecoration.jsx';
import { useReducedMotionPreference } from '../../hooks/useReducedMotionPreference.js';

const OPENED_KEY = 'wedding-envelope-opened-v1';

function hasOpenedBefore() {
  try {
    return window.sessionStorage.getItem(OPENED_KEY) === '1';
  } catch {
    return false;
  }
}

function markOpened() {
  try {
    window.sessionStorage.setItem(OPENED_KEY, '1');
  } catch {
    /* modo privado o storage no disponible */
  }
}

/**
 * Sobre digital animado.
 * - Botón real accesible (ratón, teclado, táctil).
 * - Se abre una sola vez por sesión.
 * - Transición ~1,5 s; abreviada si prefers-reduced-motion.
 * - Tras abrir, llama a onOpenComplete y desaparece sin bloquear la página.
 */
export default function WeddingEnvelope({ initials = 'I&N', logo, onOpenComplete }) {
  const reduced = useReducedMotionPreference();
  const [phase, setPhase] = useState(() => (hasOpenedBefore() ? 'done' : 'idle'));
  const [visible, setVisible] = useState(() => !hasOpenedBefore());
  const openingRef = useRef(false);
  const timersRef = useRef([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  useEffect(() => {
    if (phase === 'done' && onOpenComplete) {
      onOpenComplete();
    }
  }, [phase, onOpenComplete]);

  const handleOpen = useCallback(() => {
    if (openingRef.current || phase !== 'idle') return;
    openingRef.current = true;

    markOpened();
    setPhase('opening');

    const totalMs = reduced ? 300 : 1500;

    timersRef.current.push(
      window.setTimeout(() => {
        setPhase('done');
        setVisible(false);
      }, totalMs),
    );
  }, [phase, reduced]);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center overflow-y-auto bg-ivory px-5 py-10 safe-pt safe-pb"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.15 : 0.35, ease: 'easeInOut' }}
      role="region"
      aria-label="Invitación cerrada en un sobre"
    >
      <div className="pointer-events-none absolute left-0 top-0 w-24 opacity-70 sm:w-32">
        <BotanicalDecoration variant="corner-left" className="h-auto w-full" />
      </div>
      <div className="pointer-events-none absolute right-0 top-0 w-24 opacity-70 sm:w-32">
        <BotanicalDecoration variant="corner-right" className="h-auto w-full" />
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 w-20 rotate-180 opacity-50 sm:w-28">
        <BotanicalDecoration variant="corner-left" className="h-auto w-full" />
      </div>
      <div className="pointer-events-none absolute bottom-0 right-0 w-20 -scale-x-100 rotate-180 opacity-50 sm:w-28">
        <BotanicalDecoration variant="corner-right" className="h-auto w-full" />
      </div>

      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        <p className="mb-6 text-center text-[0.68rem] font-medium uppercase tracking-[0.32em] text-olive sm:text-[0.72rem]">
          Una invitación especial
        </p>

        <div className="envelope-scene w-full">
          <div
            className={`envelope mx-auto ${
              phase === 'opening' || phase === 'done' ? 'is-opening' : ''
            }`}
          >
            <div className="envelope-back" />
            <div className="envelope-sheen" />

            <div className="envelope-card">
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[0.35rem] border border-[#ebe3d4]/70 bg-[#fffdf8]/90 px-3 text-center">
                {logo ? (
                  <img
                    src={logo}
                    alt=""
                    className="h-12 w-12 rounded-full object-cover sm:h-14 sm:w-14"
                    width={56}
                    height={56}
                    decoding="async"
                  />
                ) : (
                  <span className="font-display text-lg text-olive sm:text-xl">{initials}</span>
                )}
                <span className="h-px w-10 bg-border" aria-hidden="true" />
                <span className="font-display text-base italic text-charcoal sm:text-lg">
                  Nos casamos
                </span>
              </div>
            </div>

            <div className="envelope-front" />
            <EnvelopeFlap />

            <button
              type="button"
              className={`envelope-seal ${phase === 'idle' ? 'envelope-hint-pulse' : ''}`}
              onClick={handleOpen}
              aria-label="Abrir la invitación. Toca el sobre para descubrir el contenido."
              disabled={phase !== 'idle'}
            >
              {logo ? (
                <img
                  src={logo}
                  alt=""
                  className="h-full w-full rounded-full object-cover"
                  width={68}
                  height={68}
                  decoding="async"
                />
              ) : (
                <span className="envelope-seal-inner">{initials}</span>
              )}
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 text-center">
          <p className="font-display text-2xl text-charcoal sm:text-[1.7rem]">
            Tienes una invitación
          </p>
          <p className="flex items-center gap-2 text-sm text-charcoal/75">
            <span
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-olive ${
                phase === 'idle' && !reduced ? 'envelope-hint-pulse' : ''
              }`}
              aria-hidden="true"
            >
              <Hand size={16} />
            </span>
            Toca el sobre para abrirla
          </p>
          <p className="sr-only" role="status" aria-live="polite">
            {phase === 'opening'
              ? 'Abriendo la invitación…'
              : phase === 'done'
                ? 'Invitación abierta'
                : 'Invitación lista para abrir'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
