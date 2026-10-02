import { useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

/**
 * Visor accesible de fotografías.
 * - Cierra con botón, Escape y clic en el fondo.
 * - Gestiona foco (devuelve el foco al elemento de origen).
 * - Bloquea el scroll solo mientras está abierto.
 */
export default function PhotoViewer({ photo, onClose }) {
  const closeRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (!photo) return undefined;

    previouslyFocused.current = document.activeElement;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    closeRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
      const node = previouslyFocused.current;
      if (node && typeof node.focus === 'function') {
        node.focus();
      }
    };
  }, [photo, onClose]);

  const handleBackdropClick = useCallback(
    (event) => {
      if (event.target === event.currentTarget) onClose();
    },
    [onClose],
  );

  return (
    <AnimatePresence>
      {photo ? (
        <motion.div
          className="photo-viewer-backdrop fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={photo.alt || 'Fotografía ampliada'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={handleBackdropClick}
        >
          <div className="relative flex max-h-full w-full max-w-3xl flex-col items-center">
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="absolute -top-2 right-0 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-charcoal shadow-soft transition hover:text-olive"
              aria-label="Cerrar visor de fotografía"
            >
              <X size={20} aria-hidden="true" />
            </button>

            <motion.img
              src={photo.src}
              alt={photo.alt || 'Fotografía de la galería'}
              className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-envelope"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              width={photo.width || undefined}
              height={photo.height || undefined}
            />

            {photo.alt ? (
              <p className="mt-4 max-w-xl text-center text-sm text-charcoal/80">{photo.alt}</p>
            ) : null}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
