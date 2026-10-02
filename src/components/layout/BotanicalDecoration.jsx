/**
 * Decoración botánica (rama de olivo) en SVG.
 * Variantes: corner-left | corner-right | sprig | divider
 */
export default function BotanicalDecoration({
  variant = 'sprig',
  className = '',
  decorative = true,
}) {
  const common = {
    className: `pointer-events-none ${className}`,
    'aria-hidden': decorative ? 'true' : undefined,
    focusable: 'false',
  };

  if (variant === 'corner-left') {
    return (
      <svg {...common} viewBox="0 0 120 140" fill="none">
        <path
          d="M12 8 C28 40, 40 70, 48 120"
          stroke="#68734B"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path d="M22 30 C34 34, 46 36, 58 32" stroke="#68734B" strokeWidth="1.1" strokeLinecap="round" />
        <path d="M28 55 C40 60, 52 62, 64 56" stroke="#68734B" strokeWidth="1.1" strokeLinecap="round" />
        <path d="M34 82 C44 88, 54 90, 62 84" stroke="#68734B" strokeWidth="1.1" strokeLinecap="round" />
        <ellipse cx="26" cy="34" rx="8" ry="3.5" transform="rotate(-28 26 34)" fill="#DCE0D0" stroke="#68734B" strokeWidth="0.8" />
        <ellipse cx="38" cy="58" rx="8" ry="3.5" transform="rotate(-18 38 58)" fill="#DCE0D0" stroke="#68734B" strokeWidth="0.8" />
        <ellipse cx="44" cy="86" rx="7" ry="3" transform="rotate(-8 44 86)" fill="#DCE0D0" stroke="#68734B" strokeWidth="0.8" />
      </svg>
    );
  }

  if (variant === 'corner-right') {
    return (
      <svg {...common} viewBox="0 0 120 140" fill="none" style={{ transform: 'scaleX(-1)' }}>
        <path
          d="M12 8 C28 40, 40 70, 48 120"
          stroke="#68734B"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path d="M22 30 C34 34, 46 36, 58 32" stroke="#68734B" strokeWidth="1.1" strokeLinecap="round" />
        <path d="M28 55 C40 60, 52 62, 64 56" stroke="#68734B" strokeWidth="1.1" strokeLinecap="round" />
        <path d="M34 82 C44 88, 54 90, 62 84" stroke="#68734B" strokeWidth="1.1" strokeLinecap="round" />
        <ellipse cx="26" cy="34" rx="8" ry="3.5" transform="rotate(-28 26 34)" fill="#DCE0D0" stroke="#68734B" strokeWidth="0.8" />
        <ellipse cx="38" cy="58" rx="8" ry="3.5" transform="rotate(-18 38 58)" fill="#DCE0D0" stroke="#68734B" strokeWidth="0.8" />
        <ellipse cx="44" cy="86" rx="7" ry="3" transform="rotate(-8 44 86)" fill="#DCE0D0" stroke="#68734B" strokeWidth="0.8" />
      </svg>
    );
  }

  if (variant === 'divider') {
    return (
      <svg {...common} viewBox="0 0 200 24" fill="none" className={`h-6 w-48 ${className}`}>
        <line x1="10" y1="12" x2="78" y2="12" stroke="#E5E1D8" strokeWidth="1" />
        <line x1="122" y1="12" x2="190" y2="12" stroke="#E5E1D8" strokeWidth="1" />
        <path
          d="M100 4 C103 8, 104 10, 100 12 C96 14, 97 16, 100 20"
          stroke="#68734B"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <ellipse cx="94" cy="10" rx="5" ry="2.2" transform="rotate(-25 94 10)" fill="#DCE0D0" stroke="#68734B" strokeWidth="0.7" />
        <ellipse cx="106" cy="14" rx="5" ry="2.2" transform="rotate(25 106 14)" fill="#DCE0D0" stroke="#68734B" strokeWidth="0.7" />
      </svg>
    );
  }

  // sprig por defecto
  return (
    <svg {...common} viewBox="0 0 80 100" fill="none" className={`h-20 w-16 ${className}`}>
      <path
        d="M40 96 C40 70, 40 40, 40 12"
        stroke="#68734B"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path d="M40 30 C28 24, 20 22, 12 24" stroke="#68734B" strokeWidth="1" strokeLinecap="round" />
      <path d="M40 48 C52 42, 60 40, 68 42" stroke="#68734B" strokeWidth="1" strokeLinecap="round" />
      <path d="M40 66 C28 60, 20 58, 14 60" stroke="#68734B" strokeWidth="1" strokeLinecap="round" />
      <ellipse cx="24" cy="24" rx="7" ry="3" transform="rotate(-35 24 24)" fill="#DCE0D0" stroke="#68734B" strokeWidth="0.7" />
      <ellipse cx="56" cy="40" rx="7" ry="3" transform="rotate(25 56 40)" fill="#DCE0D0" stroke="#68734B" strokeWidth="0.7" />
      <ellipse cx="26" cy="60" rx="7" ry="3" transform="rotate(-20 26 60)" fill="#DCE0D0" stroke="#68734B" strokeWidth="0.7" />
      <circle cx="40" cy="10" r="2.2" fill="#E9DED0" stroke="#68734B" strokeWidth="0.7" />
    </svg>
  );
}
