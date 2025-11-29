/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        slate: {
          900: '#0f172a', // color personalizado que Tailwind sí reconoce
        },
        gray: {
          900: '#111827',
          800: '#1F2937'
        }
      }
    },
  },
  plugins: [],
}
