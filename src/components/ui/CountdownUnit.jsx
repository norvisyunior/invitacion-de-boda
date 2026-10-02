import { padNumber } from '../../utils/dateUtils.js';

/**
 * Unidad del contador: número grande + etiqueta pequeña.
 */
export default function CountdownUnit({ value, label }) {
  return (
    <div className="flex min-w-0 flex-col items-center rounded-2xl border border-border/80 bg-white/70 px-1 py-3 sm:py-4">
      <span
        className="font-display text-[clamp(1.75rem,7vw,2.75rem)] leading-none text-charcoal tabular-nums"
        aria-hidden="true"
      >
        {padNumber(value)}
      </span>
      <span className="mt-2 text-[0.65rem] uppercase tracking-[0.18em] text-olive sm:text-xs">
        {label}
      </span>
    </div>
  );
}
