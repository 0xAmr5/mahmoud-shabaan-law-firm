/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        }
      }
    },
  },
  plugins: [],
}