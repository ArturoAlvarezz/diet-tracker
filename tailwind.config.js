/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0a0a0f',
          'bg-alt': '#0d0d1a',
          'bg-card': '#111128',
          purple: '#7b2ff7',
          'purple-mid': '#9333ea',
          'purple-light': '#a855f7',
          blue: '#1e1b4b',
          'blue-mid': '#312e81',
          'blue-light': '#4338ca',
          cyan: '#06b6d4',
          'cyan-light': '#22d3ee',
          text: '#e2e8f0',
          'text-muted': '#94a3b8',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        'glow-purple': '0 0 15px rgba(123,47,247,0.3)',
        'glow-cyan': '0 0 15px rgba(6,182,212,0.3)',
        'glow-purple-sm': '0 0 8px rgba(123,47,247,0.2)',
      },
      animation: {
        'cursor-blink': 'blink 1s step-end infinite',
        'scanline': 'scanline 8s linear infinite',
        'rain': 'rain 10s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        rain: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
}
