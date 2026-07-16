import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        brand: {
          cream: '#FAF8F5',
          forest: '#2D5016',
          'forest-dark': '#1E3610',
          'forest-light': '#3D6B20',
          gold: '#C8A96E',
          'gold-light': '#D9BF92',
          'gold-dark': '#A8863E',
          blush: '#E8C5C5',
          'blush-light': '#F2DADA',
          ink: '#1A1A1A',
          surface: '#FFFFFF',
          offset: '#F2EFE9',

          midnight: '#141414',
          'midnight-soft': '#1B1A18',
          'midnight-card': '#211F1C',
          'midnight-border': '#2D2A26',
          wine: '#2A1418',
          'wine-soft': '#351B20',
          parchment: '#E9E1D4',
          stone: '#B3AAA0',
          'stone-soft': '#8E867D',
        },
      },

      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
      },

      fontSize: {
        'display-xl': ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        'display-md': ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },

      spacing: {
        section: '6rem',
        container: '90rem',
      },

      borderRadius: {
        card: '1.25rem',
        btn: '0.625rem',
        xl: '1rem',
      },

      boxShadow: {
        card: '0 4px 24px 0 rgba(26, 26, 26, 0.08)',
        'card-hover': '0 8px 40px 0 rgba(26, 26, 26, 0.14)',
        panel: '0 16px 48px 0 rgba(26, 26, 26, 0.12)',
        dropdown: '0 4px 16px 0 rgba(26, 26, 26, 0.10)',
        'dark-card': '0 10px 30px 0 rgba(0, 0, 0, 0.28)',
        'dark-hover': '0 18px 50px 0 rgba(0, 0, 0, 0.34)',
      },

      maxWidth: {
        prose: '68ch',
        container: '90rem',
      },

      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-sm': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      transitionDuration: {
        fast: '150ms',
        base: '250ms',
        slow: '400ms',
        reveal: '600ms',
      },

      keyframes: {
        'slide-up-fade': {
          from: { opacity: '0', transform: 'translateY(1rem)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },

      animation: {
        'slide-up': 'slide-up-fade 400ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 300ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in': 'scale-in 250ms cubic-bezier(0.16, 1, 0.3, 1) both',
      },

      backdropBlur: {
        nav: '12px',
      },

      zIndex: {
        navbar: '50',
        dropdown: '60',
        overlay: '70',
        modal: '80',
        cookie: '90',
      },
    },
  },

  plugins: [],
}

export default config
