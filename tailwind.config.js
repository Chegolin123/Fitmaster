/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      colors: {
        'blud-black': '#0a0a0a',
        'blud-gray': '#1a1a1a',
        'blud-red': '#dc2626',
        'blud-red-dark': '#b91c1c',
      }
    },
  },
  plugins: [],
}