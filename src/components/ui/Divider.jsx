/**
 * Separador editorial con pequeño adorno botánico.
 */
export default function Divider({ className = '', label }) {
  return (
    <div
      className={`divider-ornament py-1 ${className}`}
      role={label ? 'separator' : undefined}
      aria-label={label || undefined}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none">
        <path
          d="M12 3c2.5 3.2 4 6.1 4 9a4 4 0 1 1-8 0c0-2.9 1.5-5.8 4-9z"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
        />
        <path d="M12 21v-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}
