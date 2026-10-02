# Invitación digital de boda — experiencia botánica premium

Invitación de boda en una sola página (React + Vite + Tailwind CSS + Motion), diseñada mobile-first para compartir por WhatsApp, Telegram y otras redes.

## Requisitos

- Node.js 18+ (probado con Node 24)
- npm 9+

## Ejecutar en local

```bash
npm install
npm run dev
```

Abre la URL que imprime Vite (por defecto `http://localhost:5173`).

## Compilar versión de producción

```bash
npm run build
npm run preview
```

La compilación queda en `dist/`.

## Cambiar los datos de la boda

Edita **un solo archivo**: [`src/data/wedding.js`](src/data/wedding.js)

Allí están centralizados:

- Nombres e iniciales de los novios (Isabela y Norvis, provisionales)
- Fecha, hora, zona horaria y etiquetas visibles
- Lugar, dirección y tipo de ceremonia
- Textos de invitación, historia y cierre
- Configuración de cuenta atrás, vestimenta y galería
- URL de compartir
- Enlace de WhatsApp (opcional)

Los valores marcados como **PROVISIONAL** deben sustituirse antes de compartir el enlace definitivo.

### Añadir fotografías reales

En `src/data/wedding.js`, dentro de `gallery.items`, añade objetos con `src`, `alt`, `width` y `height`. Si `items` está vacío, se muestra una composición botánica (no se inventan recuerdos).

## Secciones implementadas

| Sección | Descripción |
|--------|-------------|
| Sobre digital | Apertura táctil/teclado una vez por sesión |
| Portada | Monograma, nombres, frase y fecha |
| Invitación | Mensaje romántico |
| Nuestra historia | Opcional y editable |
| Cuenta atrás | Días, horas, minutos y segundos en tiempo real |
| Ceremonia | Fecha, lugar, mapas y .ics |
| Vestimenta | Paleta y nota opcional |
| Galería | Con visor accesible o estado botánico |
| Cierre | Agradecimiento, compartir, calendario y WhatsApp |

**No incluye RSVP** (confirmación de asistencia), según el encargo.

## Accesibilidad y movimiento

- Sobre accesible como botón real (ratón, táctil y teclado)
- Foco visible y gestión del foco al abrir / cerrar el visor
- `prefers-reduced-motion`: transiciones abreviadas
- HTML semántico, etiquetas de formulario en utilidades UI y mensajes `aria-live`

## Publicar la web

1. Compila con `npm run build`.
2. Sube la carpeta `dist/` a un hosting estático (Netlify, Vercel, Cloudflare Pages, etc.).
3. En `index.html`, reemplaza las URLs provisionales de `canonical`, `og:url`, `og:image` y `twitter:image` por tu dominio público.
4. En `src/data/wedding.js`, actualiza `share.url` con la URL definitiva.
5. Genera (o sustituye) `public/og-image.svg` por una imagen **PNG o JPG de 1200×630** con los nombres reales: algunos mensajeros no renderizan SVG en la previsualización.
6. Configura el favicon si quieres un icono distinto (`public/favicon.svg`).

## Estructura

```
src/
  components/
    envelope/     # Sobre digital animado
    layout/       # Contenedores, títulos y decoración botánica
    sections/     # Portada, historia, cuenta atrás, ceremonia, etc.
    ui/           # Botones, contador, visor, compartir, calendario
  data/wedding.js # Toda la configuración editable
  hooks/          # useCountdown, prefers-reduced-motion
  utils/          # Fechas, mapas, generación .ics
```

## Dependencias

| Paquete | Uso |
|---------|-----|
| react, react-dom | Interfaz |
| vite, @vitejs/plugin-react | Desarrollo y build |
| tailwindcss, postcss, autoprefixer | Estilos utilitarios |
| motion | Animaciones de apertura y secciones |
| lucide-react | Iconos discretos |

## Notas de privacidad

- No hay backend ni base de datos.
- No se guardan datos de invitados en el navegador.
- No incluyas números de teléfono ni claves reales en el repositorio público hasta que estén listos para compartirse.
