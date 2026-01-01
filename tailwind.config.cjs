/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ASai Brand Colors
        asai: {
          bg: '#0b0b11',
          panel: '#141421',
          border: '#26263a',
          'border-light': '#3a3054',
          text: '#f2f2f7',
          muted: '#9a9ab0',
          accent: '#a37bff',
          'accent-soft': '#c6a8ff',
          warm: '#f2c14f',
          calm: '#3bd1a2',
          danger: '#ff6b81',
          'danger-dark': '#541010',
        }
      },
      boxShadow: {
        'asai-glow': '0 0 24px rgba(163, 123, 255, 0.25)',
        'asai-glow-strong': '0 0 24px rgba(163, 123, 255, 0.5)',
      },
      backgroundImage: {
        'asai-gradient': 'radial-gradient(circle at top left, #1c1630, #090912)',
      },
      fontFamily: {
        mono: ['"Courier New"', 'Consolas', 'monospace'],
      }
    }
  },
  plugins: [],
};
