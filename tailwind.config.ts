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
          gold: '#AE8A3E',
          'gold-light': '#C8A96E',
          'gold-dark': '#8A6A28',
          blush: '#E8C5C5',
          'blush-light': '#F2DADA',
          ink: '#33231A',
          surface: '#FFFFFF',
          offset: '#F2EFE9',

          // Dark premium theme — "Si-Si Noir"
          onyx: '#FBF6EC',
          'onyx-soft': '#F5EDDC',
          midnight: '#FFFCF6',
          'midnight-soft': '#FFFFFF',
          'midnight-card': '#FFFFFF',
          'midnight-border': '#E9DCC3',
          wine: '#E7AAB9',
          'wine-soft': '#F3CBD5',
          parchment: '#33231A',
          stone: '#8A7663',
          'stone-soft': '#A8978A',
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
        'gold-glow': '0 8px 32px -6px rgba(200, 169, 110, 0.45)',
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
        // Infinite horizontal marquee — translate -50% because content is duplicated
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        // Slow drifting aurora blobs — transform only, GPU-friendly
        'aurora-drift': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(4%, -6%) scale(1.08)' },
          '66%': { transform: 'translate(-5%, 4%) scale(0.95)' },
        },
        'aurora-drift-alt': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(-6%, -4%) scale(1.1)' },
        },
        // Gentle vertical float for hero imagery
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        // Moving sheen across gold buttons
        sheen: {
          from: { backgroundPosition: '200% center' },
          to: { backgroundPosition: '-200% center' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.45', transform: 'scale(0.8)' },
        },
      },

      animation: {
        'slide-up': 'slide-up-fade 400ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 300ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in': 'scale-in 250ms cubic-bezier(0.16, 1, 0.3, 1) both',
        marquee: 'marquee 36s linear infinite',
        'marquee-slow': 'marquee 55s linear infinite',
        'marquee-reverse': 'marquee 55s linear infinite reverse',
        aurora: 'aurora-drift 18s ease-in-out infinite',
        'aurora-alt': 'aurora-drift-alt 22s ease-in-out infinite',
        float: 'float 7s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        sheen: 'sheen 5s linear infinite',
        'pulse-dot': 'pulse-dot 2.2s ease-in-out infinite',
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
