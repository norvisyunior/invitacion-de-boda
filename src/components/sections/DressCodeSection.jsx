import SectionContainer from '../layout/SectionContainer.jsx';
import SectionHeading from '../layout/SectionHeading.jsx';
import { Shirt } from 'lucide-react';

/**
 * Código de vestimenta — sección opcional.
 */
export default function DressCodeSection({ weddingData }) {
  const { dressCode, copy } = weddingData;

  if (!dressCode?.enabled) return null;

  const palette = Array.isArray(dressCode.palette) ? dressCode.palette : [];
  const note = typeof copy.dressCodeNote === 'string' ? copy.dressCodeNote.trim() : '';

  return (
    <SectionContainer id="vestimenta" tone="beige">
      <SectionHeading
        eyebrow="Elegancia natural"
        title={copy.dressCodeTitle}
        description={copy.dressCodeText}
      />

      <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-border bg-white p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sage/70 text-olive">
            <Shirt size={18} aria-hidden="true" />
          </span>
          <h3 className="font-display text-xl text-charcoal">Paleta sugerida</h3>
        </div>

        {palette.length > 0 ? (
          <ul className="mt-6 grid grid-cols-3 gap-x-4 gap-y-5 sm:grid-cols-5">
            {palette.map((swatch) => (
              <li
                key={swatch.hex + swatch.name}
                className="flex min-w-0 flex-col items-center gap-2"
              >
                <span
                  className="palette-swatch"
                  style={{ backgroundColor: swatch.hex }}
                  aria-hidden="true"
                />
                <span className="text-center text-[0.7rem] font-medium leading-tight text-charcoal">
                  {swatch.name}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-charcoal/75">
            La paleta de colores se publicará próximamente.
          </p>
        )}

        {note ? (
          <div className="mt-8 rounded-xl border border-border bg-beige/50 p-4">
            <p className="text-sm leading-relaxed text-charcoal/85">{note}</p>
          </div>
        ) : null}
      </div>
    </SectionContainer>
  );
}
