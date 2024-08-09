/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
          "app-primary": "#2D3250",
          "app-secondary": "#424769",
          "app-tertiary": "#7077A1",
          "app-quaternary": "#F6B17A"
      }
    },
  },
  plugins: [],
}

