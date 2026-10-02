import { motion } from 'motion/react';
import SectionContainer from '../layout/SectionContainer.jsx';
import SectionHeading from '../layout/SectionHeading.jsx';
import BotanicalDecoration from '../layout/BotanicalDecoration.jsx';
import { useReducedMotionPreference } from '../../hooks/useReducedMotionPreference.js';

/**
 * Nuestra historia — sección opcional y editable.
 * El contenido es provisional si la pareja no ha configurado momentos reales.
 */
export default function OurStory({ weddingData }) {
  const reduced = useReducedMotionPreference();
  const { copy, assets } = weddingData;
  const couplePhoto = assets?.couplePhoto;
  const couplePhotoAlt =
    assets?.couplePhotoAlt || 'Fotografía de Isabela y Norvis';

  if (!copy.storyEnabled) return null;

  const moments = Array.isArray(copy.storyMoments) ? copy.storyMoments : [];

  return (
    <SectionContainer id="historia" tone="beige">
      <SectionHeading
        eyebrow="Nosotros"
        title={copy.storyTitle}
        description={copy.storyText}
      />

      <div className="mx-auto mt-12 grid max-w-3xl gap-8 sm:grid-cols-2">
        {/* Fotografía de la pareja */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-ivory">
          {couplePhoto ? (
            <img
              src={couplePhoto}
              alt={couplePhotoAlt}
              className="h-full max-h-[420px] w-full object-cover object-center sm:min-h-[320px]"
              width={1200}
              height={1500}
              loading="lazy"
              decoding="async"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 p-6 text-center">
              <BotanicalDecoration variant="sprig" className="h-16 w-14" />
              <p className="max-w-[14rem] text-sm leading-relaxed text-charcoal/70">
                Espacio reservado para una fotografía de la pareja.
              </p>
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-olive">
                Añade la imagen en la configuración
              </p>
            </div>
          )}
        </div>

        <ul className="flex flex-col justify-center gap-6">
          {moments.length === 0 ? (
            <li className="rounded-2xl border border-border bg-ivory/70 p-5 text-sm text-charcoal/75">
              Aún no hay momentos publicados. Esta sección puede ocultarse desde la configuración.
            </li>
          ) : (
            moments.map((moment, index) => (
              <motion.li
                key={moment.id || index}
                className="rounded-2xl border border-border bg-ivory/70 p-5"
                initial={reduced ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
              >
                <h3 className="font-display text-xl text-charcoal">{moment.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/80">{moment.text}</p>
              </motion.li>
            ))
          )}
        </ul>
      </div>
    </SectionContainer>
  );
}
