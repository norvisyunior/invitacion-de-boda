import { useCallback, useState } from 'react';
import { motion } from 'motion/react';
import { ImageOff } from 'lucide-react';
import SectionContainer from '../layout/SectionContainer.jsx';
import SectionHeading from '../layout/SectionHeading.jsx';
import BotanicalDecoration from '../layout/BotanicalDecoration.jsx';
import PhotoViewer from '../ui/PhotoViewer.jsx';
import { useReducedMotionPreference } from '../../hooks/useReducedMotionPreference.js';

/**
 * Galería adaptable con visor accesible.
 * Sin fotos propias: composición botánica decorativa (sin inventar recuerdos).
 */
export default function GallerySection({ weddingData }) {
  const reduced = useReducedMotionPreference();
  const { gallery, copy } = weddingData;
  const [activeIndex, setActiveIndex] = useState(null);

  const items = Array.isArray(gallery?.items) ? gallery.items : [];
  const enabled = gallery?.enabled !== false && items.length > 0;

  const closeViewer = useCallback(() => setActiveIndex(null), []);

  if (!gallery?.enabled) return null;

  return (
    <SectionContainer id="galeria" tone="ivory">
      <SectionHeading
        eyebrow="Recuerdos"
        title={copy.galleryTitle}
        description={enabled ? undefined : copy.galleryNote}
      />

      {enabled ? (
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
          {items.map((photo, index) => (
            <motion.button
              key={photo.src + index}
              type="button"
              className={`gallery-tile group relative block w-full border border-border bg-beige ${
                index % 5 === 0 ? 'col-span-2 aspect-[4/5] sm:aspect-[4/5]' : 'aspect-[4/5]'
              }`}
              onClick={() => setActiveIndex(index)}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: (index % 3) * 0.06 }}
              aria-label={`Ampliar fotografía: ${photo.alt || `imagen ${index + 1}`}`}
            >
              <img
                src={photo.src}
                alt={photo.alt || ''}
                className="h-full w-full object-cover"
                loading={index < 2 ? 'eager' : 'lazy'}
                decoding="async"
                width={photo.width || 800}
                height={photo.height || 1000}
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="mx-auto mt-12 flex max-w-xl flex-col items-center rounded-2xl border border-border bg-beige/60 px-6 py-12 text-center">
          <BotanicalDecoration variant="sprig" className="h-24 w-20" />
          <p className="mt-4 flex items-center gap-2 text-sm text-charcoal/75">
            <ImageOff size={16} aria-hidden="true" />
            Pronto compartiremos algunos momentos juntos.
          </p>
          <p className="mt-2 max-w-sm text-xs leading-relaxed text-charcoal/60">
            Las fotografías reales de la pareja se añaden desde la configuración. No se muestran
            imágenes ajenas presentadas como recuerdos propios.
          </p>
        </div>
      )}

      <PhotoViewer
        photo={activeIndex != null ? items[activeIndex] : null}
        onClose={closeViewer}
      />
    </SectionContainer>
  );
}
