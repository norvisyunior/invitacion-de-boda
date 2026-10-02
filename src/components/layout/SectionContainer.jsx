/**
 * Contenedor de sección con espaciado editorial mobile-first.
 */
export default function SectionContainer({
  id,
  children,
  className = '',
  tone = 'ivory',
  as: Tag = 'section',
}) {
  const tones = {
    ivory: 'bg-ivory',
    beige: 'bg-beige',
    sage: 'bg-sage/40',
    white: 'bg-white',
  };

  return (
    <Tag
      id={id}
      className={`w-full ${tones[tone] || tones.ivory} ${className}`}
    >
      <div className="mx-auto w-full max-w-content px-5 py-16 sm:px-8 sm:py-20 md:py-24">
        {children}
      </div>
    </Tag>
  );
}
