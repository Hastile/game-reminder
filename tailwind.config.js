/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'game-primary': '#00ff88',
        'game-secondary': '#ffd700',
        'game-bg-start': '#1e3c72',
        'game-bg-end': '#2a5298',
      }
    },
  },
  plugins: [],
}