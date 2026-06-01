/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ink/inkSoft are CSS-variable driven so that light/dark mode
        // can flip the entire base palette without touching components.
        // Dark mode (default): #08020f / #120824. Light mode: cream surfaces.
        ink: 'rgb(var(--ink) / <alpha-value>)',
        inkSoft: 'rgb(var(--inkSoft) / <alpha-value>)',
        // "paper" is the inverse-of-ink token: in light mode it becomes
        // dark text, in dark mode it becomes near-white.
        paper: 'rgb(var(--paper) / <alpha-value>)',
        paperSoft: 'rgb(var(--paperSoft) / <alpha-value>)',
        flame: '#ff2d55',
        flameSoft: '#ff6b8a',
        sun: '#ffc93c',
        sunSoft: '#ffe066',
        chakra: '#22d3ee',
        chakraSoft: '#67e8f9',
        sakura: '#ff5ea8',
        sakuraSoft: '#ff8fc1',
        ki: '#a855f7',
        kiSoft: '#c084fc',
      },
      fontFamily: {
        display: ['"Bangers"', 'system-ui', 'sans-serif'],
        body: ['"Poppins"', 'system-ui', 'sans-serif'],
        jp: ['"x8y12pxDenkiChip"', 'sans-serif'],
        pop: ['"KeinannPOPjp"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        floatY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        spinSlow: {
          to: { transform: 'rotate(360deg)' },
        },
        spinReverse: {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0,0)', filter: 'hue-rotate(0deg)' },
          '20%': { transform: 'translate(-2px,1px)', filter: 'hue-rotate(15deg)' },
          '40%': { transform: 'translate(2px,-1px)', filter: 'hue-rotate(-15deg)' },
          '60%': { transform: 'translate(-1px,-1px)', filter: 'hue-rotate(25deg)' },
          '80%': { transform: 'translate(1px,1px)', filter: 'hue-rotate(-25deg)' },
        },
        sweep: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 30px rgba(255,45,85,0.6)' },
          '50%': { boxShadow: '0 0 60px rgba(255,45,85,0.9)' },
        },
      },
      animation: {
        floatY: 'floatY 6s ease-in-out infinite',
        spinSlow: 'spinSlow 28s linear infinite',
        spinReverse: 'spinReverse 40s linear infinite',
        glitch: 'glitch 2.4s infinite',
        sweep: 'sweep 4s linear infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
