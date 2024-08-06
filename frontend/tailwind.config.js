/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
          "app-purple": "#542E71",
          "app-red": "#FB3640",
          "app-yellow": "#FDCA40",
          "app-indigo": "#A799B7"
      }
    },
  },
  plugins: [],
}

