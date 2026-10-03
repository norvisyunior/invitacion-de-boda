/**
 * Datos centralizados de la invitación.
 * TODO: sustituir los valores provisionales antes de compartir el enlace definitivo.
 */
export const wedding = {
  /** Identidad */
  couple: {
    partnerA: 'Isabela',
    partnerB: 'Norvis',
    initials: 'I&N',
  },

  /**
   * Recursos visuales en /public.
   * - logo: monograma/favicon de la invitación
   * - shareImage: tarjeta de compartir (Open Graph / WhatsApp)
   * - headerBackground: fondo del hero
   */
  assets: {
    logo: '/icono-app.svg',
    shareImage: '/share-card.jpg',
    headerBackground: '/fondo-header.jpg',
    /** Fotografía de la pareja en "Nuestra historia" */
    couplePhoto: '/novios-1.jpeg',
    couplePhotoAlt: 'Isabela y Norvis, pareja de la boda',
    couplePhotoSecond: '/novios-2.jpeg',
    /** Fondo de la sección ceremonia (anillos) */
    ceremonyBackground: '/fondo-anillos.jpg',
  },

  /**
   * Fecha y hora de la boda.
   * - `startsAt`: ISO 8601 CON desplazamiento horario (obligatorio para la cuenta atrás).
   * - `timezone`: zona IANA para mostrar la hora local y generar el .ics.
   * - `durationHours`: duración estimada para el calendario.
   */
  date: {
    startsAt: '2026-12-12T16:30:00-05:00', // Cuba (America/Havana)
    timezone: 'America/Havana',
    timezoneLabel: 'Matanzas, Cuba',
    durationHours: 5,
    dateLabel: 'Sábado, 12 de diciembre de 2026',
    timeLabel: '4:30 PM',
  },

  /** Lugar de la ceremonia */
  ceremony: {
    enabled: true,
    title: 'Ceremonia y celebración',
    type: 'Ceremonia religiosa', // PROVISIONAL
    venueName: '', // sin nombre visible en la web
    address: '', // sin marca en Maps — se usan coordenadas
    /**
     * Referencia de ubicación desde la carretera.
     * Sustituye al nombre del lugar en la sección de ceremonia.
     */
    reference:
      'Cuando va por la carretera de la costa, más o menos 3 km de la termoeléctrica, verá a la derecha carteles con los nombres de las casas: verá Casa Davalos, después BARROSO y en la siguiente entrada a la derecha entre. Hay un portón, la entrada no se ve de la carretera.',
    /**
     * Coordenadas reales de la boda (GPS).
     * Se usan para el enlace de Google Maps aunque el lugar no tenga ficha.
     */
    coordinates: {
      lat: 23.13244,
      lng: -81.54834,
    },
    coordinatesLabel: '23.13244, -81.54834',
    notes: 'La celebración continúa en el mismo lugar.',
  },

  /** Textos editoriales */
  copy: {
    eyebrow: 'NOS CASAMOS',
    romanticLine: 'Dos familias, un mismo camino y una promesa de amor.',
    invitationTitle:
      'Hay momentos que se vuelven inolvidables cuando se comparten con las personas que queremos.',
    invitationBody:
      'Con el corazón lleno de emoción, queremos celebrar nuestro enlace rodeados de quienes más queremos. Tu presencia hará de este día un recuerdo eterno.',
    storyEnabled: true,
    storyTitle: 'Nuestra historia',
    storyText:
      'Todo empezó de una manera sencilla: una conversación que no quería terminar. Desde entonces, cada día ha sido una pequeña aventura compartida.',
    storyMoments: [
      {
        id: 'moment-1',
        title: 'El primer “hola”',
        text: 'Todo comenzó con una llamada por trabajo… Ella buscaba una información y él encontró la oportunidad de pedirle su número. Un mensaje aquella tarde bastó para que comenzara una historia que ninguno de los dos imaginaba.',
      },
      {
        id: 'moment-2',
        title: 'La promesa',
        text: 'Casi desde el comienzo empezamos a imaginar un futuro juntos. Entre planes, viajes y sueños compartidos, apareció uno más grande: casarnos. En mayo, frente al mar, él se arrodilló y aquel sueño se convirtió en una promesa.',
      },
    ],
    closingLine: 'Lo más bonito de este día será compartirlo con ustedes.',
    countdownTitle: 'Cuenta atrás',
    ceremonyTitle: 'Detalles de la ceremonia',
    dressCodeTitle: 'Código de vestimenta',
    dressCodeText:
      'Te invitamos a vestirte con elegancia natural y comodidad. Tonos claros y suaves encajan perfectamente con la celebración.',
    dressCodeNote: 'Si así lo desean, por favor evitar los colores blanco, negro y rojo.',
    galleryTitle: 'Galería',
    galleryNote: 'Pronto compartiremos algunos momentos juntos.',
    mapButton: 'Abrir en Google Maps',
    calendarButton: 'Añadir al calendario',
    shareButton: 'Compartir invitación',
    copyLinkButton: 'Copiar enlace',
    copiedMessage: 'Enlace copiado',
    shareFallback: 'Copia el enlace para enviarlo por WhatsApp o Telegram.',
  },

  /** Galería — desactivada: no se muestran fotos hasta tener imágenes propias */
  gallery: {
    enabled: false,
    items: [],
    // Ejemplo de uso (añadir URLs reales de los novios):
    // items: [
    //   {
    //     src: '/photos/novios-1.jpg',
    //     alt: 'Isabela y Norvis sonriendo al atardecer',
    //     width: 1200,
    //     height: 1500,
    //   },
    // ],
  },

  /** Código de vestimenta */
  dressCode: {
    enabled: true,
    palette: [
      { name: 'Verde oliva', hex: '#68734B' },
      { name: 'Verde salvia', hex: '#DCE0D0' },
      { name: 'Champán', hex: '#E9DED0' },
      { name: 'Beige suave', hex: '#F0EBE1' },
      { name: 'Marfil', hex: '#FAF9F5' },
    ],
  },

  /** Cuenta atrás */
  countdown: {
    enabled: true,
    pastMessage:
      '¡Este día ya forma parte de nuestra historia! Gracias por acompañarnos.',
  },

  /** Compartir y enlaces externos */
  share: {
    title: 'Nos casamos · Invitación de boda',
    text: 'Tienes una invitación especial. Toca el sobre para abrirla.',
    // URL pública definitiva cuando se publique la web
    url: 'https://invitacion-de-boda-nu.vercel.app/',
  },

  /** WhatsApp — dejar vacío si no se configura */
  whatsapp: {
    enabled: false,
    // Ejemplo: '584121234567' (solo dígitos, con código de país)
    phone: '',
    message:
      'Hola, os escribo para consultar la invitación de vuestra boda. ¿Podéis confirmarme un detalle?',
  },
};

export default wedding;
