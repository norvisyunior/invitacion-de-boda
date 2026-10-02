import { CalendarDays, Clock, MapPin, Navigation } from 'lucide-react';
import SectionHeading from '../layout/SectionHeading.jsx';
import Button from '../ui/Button.jsx';
import AddToCalendarButton from '../ui/AddToCalendarButton.jsx';
import BotanicalDecoration from '../layout/BotanicalDecoration.jsx';
import { buildMapsUrl, formatCoordinates } from '../../utils/mapUtils.js';
import {
  parseWeddingDate,
  formatWeddingDateLabel,
  formatWeddingTimeLabel,
} from '../../utils/dateUtils.js';

/**
 * Detalles de la ceremonia y ubicación.
 * Fondo con la imagen de anillos + velos para legibilidad.
 * Soporta coordenadas GPS cuando el lugar no tiene ficha en Google Maps.
 */
export default function CeremonyDetails({ weddingData }) {
  const { ceremony, date, couple, copy, assets } = weddingData;
  const ceremonyBackground = assets?.ceremonyBackground;

  if (!ceremony?.enabled) return null;

  const mapsUrl = buildMapsUrl(ceremony);
  const coordsLabel = formatCoordinates(
    ceremony.coordinates,
    ceremony.coordinatesLabel || ceremony.address || '',
  );
  const startMs = parseWeddingDate(date?.startsAt);

  const dateLine =
    startMs && date?.timezone
      ? formatWeddingDateLabel(startMs, date.timezone)
      : date?.dateLabel || '';

  const timeLine =
    startMs && date?.timezone
      ? formatWeddingTimeLabel(startMs, date.timezone)
      : date?.timeLabel || '';

  return (
    <section id="ceremonia" className="relative w-full overflow-hidden bg-white">
      {ceremonyBackground ? (
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <img
            src={ceremonyBackground}
            alt=""
            className="h-full w-full object-cover object-center"
            width={1024}
            height={1280}
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-white/78 sm:bg-white/72" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/55 via-transparent to-white/85" />
        </div>
      ) : null}

      <div className="relative z-10 mx-auto w-full max-w-content px-5 py-16 sm:px-8 sm:py-20 md:py-24">
        <SectionHeading
          eyebrow="El gran día"
          title={copy.ceremonyTitle || ceremony.title}
        />

        <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
          <article className="rounded-2xl border border-border/70 bg-white/45 p-6 shadow-soft backdrop-blur-[1px]">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage/70 text-olive">
                <CalendarDays size={18} aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-xl text-charcoal">Fecha</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/80">{dateLine}</p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-border/70 bg-white/45 p-6 shadow-soft backdrop-blur-[1px]">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage/70 text-olive">
                <Clock size={18} aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-xl text-charcoal">Hora</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/80">{timeLine}</p>
              </div>
            </div>
          </article>

          {/* Ubicación editorial */}
          <article className="relative overflow-hidden rounded-2xl border border-border/70 bg-white/45 shadow-soft backdrop-blur-[1px] sm:col-span-2">
            <div className="pointer-events-none absolute -right-6 -top-6 w-32 opacity-45">
              <BotanicalDecoration variant="corner-right" className="h-auto w-full" />
            </div>

            <div className="relative p-6 sm:p-8">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-olive text-white shadow-soft">
                  <MapPin size={18} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-xl text-charcoal">Ubicación</h3>
                  {ceremony.reference ? (
                    <p className="mt-2 text-sm leading-relaxed text-charcoal/85 sm:text-[0.95rem]">
                      {ceremony.reference}
                    </p>
                  ) : null}
                  {ceremony.venueName ? (
                    <p className="mt-2 font-display text-lg text-charcoal sm:text-xl">
                      {ceremony.venueName}
                    </p>
                  ) : null}
                  {ceremony.address ? (
                    <p className="mt-1 break-words text-sm leading-relaxed text-charcoal/80">
                      {ceremony.address}
                    </p>
                  ) : null}
                  {ceremony.notes ? (
                    <p className="mt-3 text-sm italic text-charcoal/75">{ceremony.notes}</p>
                  ) : null}
                </div>
              </div>

              {/* Tarjeta GPS estilizada */}
              {coordsLabel ? (
                <div className="mt-6 overflow-hidden rounded-xl border border-olive/25 bg-white/72">
                  <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div className="flex items-center gap-4">
                      {/* Mini “mapa” decorativo con pin */}
                      <div
                        className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-sage/45"
                        aria-hidden="true"
                      >
                        <svg viewBox="0 0 64 64" className="h-full w-full">
                          <rect width="64" height="64" fill="#DCE0D0" />
                          <path
                            d="M0 40 H64 M0 22 H64 M18 0 V64 M46 0 V64"
                            stroke="#68734B"
                            strokeOpacity="0.2"
                            strokeWidth="1"
                          />
                          <path
                            d="M8 52 C20 40, 28 36, 36 28 S52 12, 60 8"
                            stroke="#68734B"
                            strokeOpacity="0.35"
                            strokeWidth="1.5"
                            fill="none"
                          />
                          <circle cx="36" cy="28" r="10" fill="#68734B" fillOpacity="0.15" />
                          <path
                            d="M36 18c-4.4 0-8 3.5-8 7.9 0 5.9 8 14.1 8 14.1s8-8.2 8-14.1c0-4.4-3.6-7.9-8-7.9z"
                            fill="#68734B"
                          />
                          <circle cx="36" cy="26" r="3" fill="#FAF9F5" />
                        </svg>
                      </div>

                      <div className="min-w-0">
                        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-olive-dark">
                          Punto de encuentro
                        </p>
                        <p className="mt-1 font-display text-lg tracking-wide text-charcoal tabular-nums">
                          {coordsLabel}
                        </p>
                        <p className="mt-0.5 text-xs text-charcoal/90">
                          Coordenadas GPS del lugar de la celebración
                        </p>
                      </div>
                    </div>

                    {mapsUrl ? (
                      <Button
                        as="a"
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full shrink-0 sm:w-auto"
                      >
                        <Navigation size={18} aria-hidden="true" />
                        {copy.mapButton || 'Cómo llegar'}
                      </Button>
                    ) : null}
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-charcoal/70">
                  La ubicación se confirmará próximamente.
                </p>
              )}

              <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <div className="flex flex-col items-stretch gap-2 sm:items-start">
                  <AddToCalendarButton weddingData={weddingData} />
                </div>
              </div>

              <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-charcoal/85">
                <Clock size={14} aria-hidden="true" />
                <span>
                  Hora local en {date?.timezoneLabel || 'Matanzas, Cuba'}.
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  {couple.partnerA} & {couple.partnerB}
                </span>
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
