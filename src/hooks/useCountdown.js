import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Cuenta atrás en tiempo real hasta una fecha objetivo.
 * - Un único intervalo.
 * - Se limpia al desmontar.
 * - Respeta prefers-reduced-motion (misma lógica, animaciones del padre pueden acortarse).
 */
export function useCountdown(targetMs) {
  const [remaining, setRemaining] = useState(() => {
    if (!Number.isFinite(targetMs)) {
      return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }
    const now = Date.now();
    const total = Math.max(0, targetMs - now);
    const totalSeconds = Math.floor(total / 1000);
    return {
      total,
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
      isPast: targetMs <= now,
    };
  });

  const tickRef = useRef(null);

  const compute = useCallback(() => {
    if (!Number.isFinite(targetMs)) {
      return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }
    const now = Date.now();
    const total = Math.max(0, targetMs - now);
    const totalSeconds = Math.floor(total / 1000);
    return {
      total,
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
      isPast: targetMs <= now,
    };
  }, [targetMs]);

  useEffect(() => {
    setRemaining(compute());

    tickRef.current = window.setInterval(() => {
      setRemaining(compute());
    }, 1000);

    return () => {
      if (tickRef.current != null) {
        window.clearInterval(tickRef.current);
        tickRef.current = null;
      }
    };
  }, [compute]);

  return remaining;
}

export default useCountdown;
