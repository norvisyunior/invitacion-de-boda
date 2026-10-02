import { motion } from 'motion/react';
import { useReducedMotionPreference } from '../../hooks/useReducedMotionPreference.js';
import BotanicalDecoration from './BotanicalDecoration.jsx';

/**
 * Encabezado de sección con animación de entrada y línea decorativa.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className = '',
}) {
  const reduced = useReducedMotionPreference();
  const alignClass = align === 'left' ? 'items-start text-left' : 'items-center text-center';

  return (
    <motion.header
      className={`flex flex-col gap-3 ${alignClass} ${className}`}
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {eyebrow ? (
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.28em] text-olive">
          {eyebrow}
        </p>
      ) : null}

      {title ? (
        <h2 className="max-w-2xl font-display text-[clamp(1.75rem,5.5vw,2.5rem)] leading-[1.2] text-charcoal">
          {title}
        </h2>
      ) : null}

      <BotanicalDecoration variant="divider" className="my-1 opacity-90" />

      {description ? (
        <p className="max-w-xl text-base leading-relaxed text-charcoal/80 sm:text-[1.05rem]">
          {description}
        </p>
      ) : null}
    </motion.header>
  );
}
