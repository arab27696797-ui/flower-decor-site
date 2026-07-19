// tailwind.config.ts
// Si-Si — Tailwind design tokens.
// Brand palette: ivory/cream base, gold accents, blush pink (wine) touches,
// deep green (moss) secondary accents — light festive theme.
// Extended with soft pastel "celebration" hues (lilac, peach, sky, mint) —
// additive only, all legacy brand tokens are preserved unchanged.

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // Base surfaces — light festive scale (kept token names for compatibility)
          onyx:             '#FBF6EC',  // warm ivory — section base
          'onyx-soft':      '#F7EEDC',  // slightly deeper ivory — alt sections
          midnight:         '#FFFCF6',  // near-white — cards / forms base
          'midnight-soft':  '#FFF9EE',  // soft white — inputs
          'midnight-card':  '#FFFDF9',  // card surface
          'midnight-border':'#E9DCC3',  // warm hairline border

          // Text colors (dark on light)
          parchment: '#33231A',         // deep espresso — primary text
          stone:     '#8A7663',         // warm taupe — secondary text
          'stone-soft': '#83705D',      // taupe with AA contrast on white — placeholders / small text

          // Accents
          gold:        '#AE8A3E',       // main gold (festive, readable on white)
          'gold-light':'#C8A96E',       // lighter gold for gradients/hover
          'gold-dark': '#8A6A28',       // deeper gold for small labels / links
          wine:        '#E7AAB9',       // blush pink — festive accents, glows
          'wine-dark': '#C97F95',       // deeper blush
          moss:        '#2D5016',       // deep leaf green — eco accents
          'moss-soft': '#5E7B4A',       // lighter green
          ink:         '#33231A',       // button text on gold

          // Celebration pastels — soft rainbow hues for festive glows.
          // Additive extension: used only in decorative aurora/glow layers,
          // never for text, so WCAG contrast is unaffected.
          lilac:       '#B9A8E4',       // soft lavender — celebration glow
          peach:       '#F3C9A4',       // warm apricot — celebration glow
          sky:         '#AACBEA',       // powder blue — celebration glow
          mint:        '#B2D9C0',       // soft mint — celebration glow
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(2.6rem, 6.2vw, 4.6rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.1rem, 4.6vw, 3.4rem)', { lineHeight: '1.1',  letterSpacing: '-0.015em' }],
        'display-md': ['clamp(1.7rem, 3.4vw, 2.5rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
      },
      borderRadius: {
        card: '18px',
        btn:  '9999px',
      },
      boxShadow: {
        // Warm, soft shadows tuned for the light theme (espresso-tinted)
        'dark-card':  '0 10px 30px 0 rgba(51, 35, 26, 0.10)',
        'dark-hover': '0 18px 50px 0 rgba(51, 35, 26, 0.15)',
        'gold-glow':  '0 6px 24px 0 rgba(174, 138, 62, 0.35)',
        card:         '0 10px 30px 0 rgba(51, 35, 26, 0.10)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '250ms',
        slow: '450ms',
      },
      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        aurora: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%':      { transform: 'translate(4%, -3%) scale(1.06)' },
          '66%':      { transform: 'translate(-3%, 4%) scale(0.97)' },
        },
        sheen: {
          from: { transform: 'translateX(-150%) skewX(-12deg)' },
          to:   { transform: 'translateX(250%) skewX(-12deg)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.35' },
        },
      },
      animation: {
        'fade-up':      'fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in':      'fade-in 0.6s ease-out both',
        marquee:        'marquee 32s linear infinite',
        'marquee-slow': 'marquee 55s linear infinite',
        'marquee-reverse': 'marquee 55s linear infinite reverse',
        float:          'float 7s ease-in-out infinite',
        'float-slow':   'float 10s ease-in-out infinite',
        aurora:         'aurora 16s ease-in-out infinite',
        'aurora-alt':   'aurora 20s ease-in-out infinite reverse',
        sheen:          'sheen 2.8s ease-in-out infinite',
        'pulse-dot':    'pulse-dot 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
