import { useState } from 'react';
import { Check, Copy, Share2 } from 'lucide-react';
import Button from './Button.jsx';

/**
 * Comparte la invitación con Web Share API o copia el enlace como alternativa.
 * `tone`: 'light' para fondos claros | 'dark' para el cierre oliva.
 */
export default function ShareButton({ shareConfig, className = '', tone = 'light' }) {
  const [status, setStatus] = useState('idle'); // idle | copied | shared | error
  const [message, setMessage] = useState('');

  const url = shareConfig?.url?.trim() || '';
  const title = shareConfig?.title || 'Invitación de boda';
  const text = shareConfig?.text || '';
  const hintClass = tone === 'dark' ? 'text-sage/90' : 'text-charcoal/70';

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const input = document.createElement('input');
        input.value = url;
        input.setAttribute('readonly', '');
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setStatus('copied');
      setMessage('Enlace copiado');
    } catch {
      setStatus('error');
      setMessage('No se pudo copiar el enlace. Cópialo manualmente.');
    }
  };

  const handleShare = async () => {
    if (!url) {
      setStatus('error');
      setMessage('La URL de compartir todavía no está configurada.');
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        setStatus('shared');
        setMessage('Invitación compartida');
        return;
      } catch (error) {
        if (error?.name === 'AbortError') {
          setStatus('idle');
          setMessage('');
          return;
        }
      }
    }

    await copyToClipboard();
  };

  const handleCopy = async () => {
    if (!url) {
      setStatus('error');
      setMessage('La URL de compartir todavía no está configurada.');
      return;
    }
    await copyToClipboard();
  };

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {tone === 'dark' ? (
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={handleShare}
            disabled={!url}
            className="border-champagne/45 bg-white/95 text-charcoal hover:border-champagne hover:bg-white"
          >
            <Share2 size={18} aria-hidden="true" />
            Compartir invitación
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={handleCopy}
            disabled={!url}
            className="border-champagne/45 bg-white/95 text-charcoal hover:border-champagne hover:bg-white"
          >
            {status === 'copied' ? (
              <Check size={18} aria-hidden="true" />
            ) : (
              <Copy size={18} aria-hidden="true" />
            )}
            {status === 'copied' ? 'Enlace copiado' : 'Copiar enlace'}
          </Button>

          {message ? (
            <p
              className="min-h-[1.25rem] text-center text-xs text-sage/90"
              role="status"
              aria-live="polite"
            >
              {message}
            </p>
          ) : (
            <span className="sr-only" role="status" aria-live="polite">
              {message}
            </span>
          )}
        </>
      ) : (
        <>
          <Button type="button" onClick={handleShare} disabled={!url}>
            <Share2 size={18} aria-hidden="true" />
            Compartir invitación
          </Button>

          <Button type="button" variant="secondary" onClick={handleCopy} disabled={!url}>
            {status === 'copied' ? (
              <Check size={18} aria-hidden="true" />
            ) : (
              <Copy size={18} aria-hidden="true" />
            )}
            {status === 'copied' ? 'Enlace copiado' : 'Copiar enlace'}
          </Button>

          {message ? (
            <p
              className={`min-h-[1.25rem] text-center text-xs ${hintClass}`}
              role="status"
              aria-live="polite"
            >
              {message}
            </p>
          ) : (
            <span className="sr-only" role="status" aria-live="polite">
              {message}
            </span>
          )}
        </>
      )}
    </div>
  );
}
