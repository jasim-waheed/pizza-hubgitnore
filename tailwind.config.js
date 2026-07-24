/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        char: {
          950: '#17120D',
          900: '#211913',
          800: '#2B221A',
          600: '#4A3B2C'
        },
        crust: {
          50: '#FFF8ED',
          100: '#FCEFD9'
        },
        tomato: {
          600: '#E8432A',
          700: '#C7361F',
          100: '#FCE0D9'
        },
        basil: {
          600: '#3C6E47',
          700: '#2E5637',
          100: '#DDEBE0'
        },
        semolina: {
          400: '#F2B705',
          500: '#D9A400'
        }
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui'],
        ticket: ['"IBM Plex Mono"', 'ui-monospace', 'monospace']
      },
      backgroundImage: {
        'diagonal-lines':
          'repeating-linear-gradient(135deg, rgba(23,18,13,0.04) 0px, rgba(23,18,13,0.04) 2px, transparent 2px, transparent 14px)'
      }
    }
  },
  plugins: []
};
