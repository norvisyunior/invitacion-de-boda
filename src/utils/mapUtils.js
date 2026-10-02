/** Enlaces de mapas a partir de coordenadas o dirección configurable. */

/**
 * Normaliza coordenadas GPS.
 * @returns {{lat: number, lng: number}|null}
 */
export function normalizeCoordinates(coordinates) {
  if (!coordinates) return null;
  const lat = Number(coordinates.lat);
  const lng = Number(coordinates.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { lat, lng };
}

/**
 * Construye un enlace de Google Maps.
 * Prioriza coordenadas GPS; si no hay, usa la dirección codificada.
 * @param {{address?: string, coordinates?: {lat: number|string, lng: number|string}}} location
 * @returns {string|null}
 */
export function buildMapsUrl(location) {
  const coords = normalizeCoordinates(location?.coordinates);
  if (coords) {
    return `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
  }

  const address = typeof location === 'string' ? location : location?.address;
  if (!address || typeof address !== 'string') return null;
  const trimmed = address.trim();
  if (!trimmed) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`;
}

/**
 * Formatea coordenadas para mostrar: 23.13244, -81.54834
 */
export function formatCoordinates(coordinates, fallbackLabel = '') {
  const coords = normalizeCoordinates(coordinates);
  if (!coords) return fallbackLabel || '';
  return `${coords.lat}, ${coords.lng}`;
}
