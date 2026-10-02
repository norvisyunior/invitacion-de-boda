/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FAF9F5',
        white: '#FFFFFF',
        olive: '#68734B',
        'olive-dark': '#454D35',
        sage: '#DCE0D0',
        charcoal: '#38392F',
        champagne: '#E9DED0',
        beige: '#F0EBE1',
        border: '#E5E1D8',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', '"Times New Roman"', 'serif'],
        body: ['Inter', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      maxWidth: {
        reading: '40rem',
        content: '56rem',
      },
      screens: {
        xs: '320px',
      },
    },
  },
  plugins: [],
};
