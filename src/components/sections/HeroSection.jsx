import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import BotanicalDecoration from '../layout/BotanicalDecoration.jsx';
import { useReducedMotionPreference } from '../../hooks/useReducedMotionPreference.js';

/**
 * Portada principal de la invitación.
 * Usa el monograma (`assets.logo`) y el fondo de cabecera (`assets.headerBackground`).
 */
export default function HeroSection({ weddingData }) {
  const reduced = useReducedMotionPreference();
  const { couple, date, copy, assets } = weddingData;
  const logo = assets?.logo;
  const headerBg = assets?.headerBackground;

  return (
    <section
      id="inicio"
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-ivory px-5 py-20 text-center safe-pt safe-pb"
      aria-labelledby="hero-title"
    >
      {headerBg ? (
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <img
            src={headerBg}
            alt=""
            className="h-full w-full object-cover object-center"
            width={1024}
            height={1536}
            fetchpriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-ivory/78 sm:bg-ivory/72" />
          <div className="absolute inset-0 bg-gradient-to-b from-ivory/55 via-transparent to-ivory" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ivory to-transparent" />
        </div>
      ) : null}

      <motion.div
        className="relative z-10 flex w-full max-w-xl flex-col items-center"
        initial={reduced ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="mb-8 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-olive/40 bg-white/70 sm:h-24 sm:w-24"
        >
          {logo ? (
            <img
              src={logo}
              alt=""
              className="h-full w-full object-cover"
              width={96}
              height={96}
              decoding="async"
            />
          ) : (
            <span
              className="font-display text-2xl tracking-wide text-olive sm:text-[1.75rem]"
              aria-hidden="true"
            >
              {couple.initials}
            </span>
          )}
        </div>

        <p className="text-[0.7rem] font-medium uppercase tracking-[0.32em] text-olive">
          {copy.eyebrow}
        </p>

        <h1
          id="hero-title"
          className="mt-5 font-display text-[clamp(2.4rem,10vw,3.8rem)] leading-[1.08] text-charcoal"
        >
          {couple.partnerA}
          <span className="mx-2 block font-display text-olive italic sm:mx-3 sm:inline">
            &amp;
          </span>
          <span className="sm:inline">{couple.partnerB}</span>
        </h1>

        <div className="my-7 flex w-full max-w-xs items-center justify-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <BotanicalDecoration variant="sprig" className="h-14 w-12 opacity-90" />
          <span className="h-px flex-1 bg-border" />
        </div>

        <p className="max-w-md font-display text-lg italic leading-relaxed text-charcoal/85 sm:text-xl">
          {copy.romanticLine}
        </p>

        <p className="mt-6 text-sm uppercase tracking-[0.18em] text-olive sm:text-base">
          {date.dateLabel}
        </p>

        <motion.a
          href="#mensaje"
          className="mt-14 inline-flex min-h-[2.75rem] flex-col items-center gap-1 text-olive"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          aria-label="Continuar explorando la invitación"
        >
          <span className="text-[0.65rem] uppercase tracking-[0.22em]">Descubre más</span>
          <span
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white ${
              reduced ? '' : 'envelope-hint-pulse'
            }`}
          >
            <ChevronDown size={18} aria-hidden="true" />
          </span>
        </motion.a>
      </motion.div>
    </section>
  );
}
