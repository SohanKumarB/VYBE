/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vybe: {
          void: '#05030a',
          dark: '#0a0714',
          card: '#110b22',
          surface: '#170f30',
          glass: 'rgba(23, 15, 48, 0.65)',
          glassBorder: 'rgba(168, 85, 247, 0.18)',
          glowPurple: '#a855f7',
          glowCyan: '#00f5ff',
          neonPink: '#f43f5e',
          textMuted: '#94a3b8',
          textSubtle: '#64748b'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Orbitron', 'Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'neon-purple': '0 0 25px -3px rgba(168, 85, 247, 0.45)',
        'neon-cyan': '0 0 25px -3px rgba(0, 245, 255, 0.45)',
        'neon-combo': '0 0 35px -5px rgba(168, 85, 247, 0.35), 0 0 20px -2px rgba(0, 245, 255, 0.25)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-flow': 'glowFlow 6s ease infinite alternate',
        'spin-slow': 'spin 20s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        glowFlow: {
          '0%': { borderColor: 'rgba(168, 85, 247, 0.3)', boxShadow: '0 0 20px rgba(168, 85, 247, 0.2)' },
          '100%': { borderColor: 'rgba(0, 245, 255, 0.4)', boxShadow: '0 0 25px rgba(0, 245, 255, 0.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
