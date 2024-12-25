/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      transitionProperty: {
        "height": "height"
      },
      colors: {
          "app-primary": "#2D3250",
          "app-secondary": "#424769",
          "app-tertiary": "#7077A1",
          "app-quaternary": "#F6B17A"
          // "app-quaternary": "#C2D9FF",
          // "app-tertiary": "#8E8FFA",
          // "app-secondary": "#7752FE",
          // "app-primary": "#190482"
      }
    },
  },
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        '.no-scrollbar::-webkit-scrollbar': {
          'display': 'none'
        },
        'no-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none'
        }
      })
    })
  ],
}

