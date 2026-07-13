// tailwind.config.ts
// PRIMA Decor — Tailwind CSS configuration.
// Extends the default theme with brand design tokens that match:
//   - CSS custom properties defined in app/globals.css
//   - next/font CSS variables injected by app/layout.tsx
//   - Class names used across all accepted site and calculator components
//
// IMPORTANT — opacity modifier compatibility:
// Colors are defined as HEX strings (not rgb() wrappers).
// Tailwind v3 JIT automatically enables opacity modifiers (e.g. text-brand-ink/65,
// bg-brand-forest/10, border-brand-gold/30) for any color defined as a plain hex value.
// Do NOT wrap values in rgb() or use CSS variables directly in the colors object —
// that would break the opacity modifier pattern.

import type { Config } from 'tailwindcss'

const config: Config = {
  // -------------------------------------------------------------------------
  // Content paths — all files that may contain Tailwind class names
  // -------------------------------------------------------------------------
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}', // kept for safety if any pages/ exist
  ],

  // -------------------------------------------------------------------------
  // No dark mode variant — single light theme for a focused conversion site
  // -------------------------------------------------------------------------
  darkMode: 'class', // kept for future use; no dark palette defined yet

  theme: {
    extend: {

      // -----------------------------------------------------------------------
      // Brand color palette
      // All values are plain HEX — required for Tailwind opacity modifier support.
      // bg-brand-ink/10, text-brand-forest/70, border-brand-gold/30 etc. all work.
      //
      // Naming mirrors CSS variables in globals.css (:root --color-*) for consistency:
      //   brand.cream        → --color-cream        #FAF8F5
      //   brand.forest       → --color-forest        #2D5016
      //   brand.forest-dark  → --color-forest-dark   #1E3610
      //   brand.forest-light → --color-forest-light  #3D6B20
      //   brand.gold         → --color-gold          #C8A96E
      //   brand.gold-light   → --color-gold-light    #D9BF92
      //   brand.gold-dark    → --color-gold-dark     #A8863E
      //   brand.blush        → --color-blush         #E8C5C5
      //   brand.blush-light  → --color-blush-light   #F2DADA
      //   brand.ink          → --color-ink           #1A1A1A
      //   brand.surface      → --color-surface-card  #FFFFFF
      //   brand.offset       → --color-surface-offset #F2EFE9
      // -----------------------------------------------------------------------
      colors: {
        brand: {
          // Page background
          cream:          '#FAF8F5',

          // Primary dark green
          forest:         '#2D5016',
          'forest-dark':  '#1E3610',
          'forest-light': '#3D6B20',

          // Gold accent
          gold:           '#C8A96E',
          'gold-light':   '#D9BF92',
          'gold-dark':    '#A8863E',

          // Soft pink accent
          blush:          '#E8C5C5',
          'blush-light':  '#F2DADA',

          // Primary text
          ink:            '#1A1A1A',

          // Surface layers
          surface:        '#FFFFFF',
          offset:         '#F2EFE9',
        },
      },

      // -----------------------------------------------------------------------
      // Font families
      // CSS variables --font-cormorant and --font-inter are injected by
      // next/font/google in app/layout.tsx via the className on <html>.
      // Tailwind's JIT picks them up through var(--font-*) references here.
      //
      // Usage in components:
      //   font-display → Cormorant Garamond (headings, hero text)
      //   font-sans    → Inter (body, UI, forms, labels)
      // -----------------------------------------------------------------------
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', '"Times New Roman"', 'serif'],
        sans:    ['var(--font-inter)',     'system-ui', '-apple-system',   'sans-serif'],
      },

      // -----------------------------------------------------------------------
      // Fluid display type scale
      // These mirror the CSS custom properties in globals.css :root.
      // Usage: text-display-xl, text-display-lg, text-display-md
      // Each entry: [fontSize, { lineHeight, letterSpacing }]
      // -----------------------------------------------------------------------
      fontSize: {
        'display-xl': ['clamp(2.5rem, 6vw, 5rem)',  { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2rem,   4vw, 3.5rem)', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        'display-md': ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.2',  letterSpacing: '-0.01em' }],
      },

      // -----------------------------------------------------------------------
      // Spacing tokens
      // section  — standard vertical section padding (used in py-section)
      // container — max content width (used in max-w-container)
      // -----------------------------------------------------------------------
      spacing: {
        section:    '6rem',   // 96px — section vertical rhythm
        container:  '90rem',  // 1440px — max page width
      },

      // -----------------------------------------------------------------------
      // Border radius
      // card — rounded-card for product/portfolio cards
      // btn  — rounded-btn for buttons
      // -----------------------------------------------------------------------
      borderRadius: {
        card: '1.25rem',   // 20px
        btn:  '0.625rem',  // 10px
        xl:   '1rem',      // 16px — keep Tailwind default xl in sync
      },

      // -----------------------------------------------------------------------
      // Box shadows
      // Tone-matched to warm cream surfaces (no pure black).
      // card       — resting elevation for cards
      // card-hover — elevated state on hover
      // panel      — modals, overlays, dropdown menus
      // dropdown   — nav dropdowns, select menus
      // -----------------------------------------------------------------------
      boxShadow: {
        card:        '0 4px  24px 0 rgba(26, 26, 26, 0.08)',
        'card-hover':'0 8px  40px 0 rgba(26, 26, 26, 0.14)',
        panel:       '0 16px 48px 0 rgba(26, 26, 26, 0.12)',
        dropdown:    '0 4px  16px 0 rgba(26, 26, 26, 0.10)',
      },

      // -----------------------------------------------------------------------
      // Max width overrides
      // prose — comfortable reading line length for legal/policy pages
      // -----------------------------------------------------------------------
      maxWidth: {
        prose:     '68ch',
        container: '90rem',
      },

      // -----------------------------------------------------------------------
      // Transition timing functions — used in component-level transitions
      // -----------------------------------------------------------------------
      transitionTimingFunction: {
        'out-expo':  'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-sm': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      // -----------------------------------------------------------------------
      // Transition durations
      // -----------------------------------------------------------------------
      transitionDuration: {
        fast:   '150ms',
        base:   '250ms',
        slow:   '400ms',
        reveal: '600ms',
      },

      // -----------------------------------------------------------------------
      // Animation keyframes + utilities
      // slide-up-fade — cookie banner entrance (defined in globals.css,
      //                 referenced here for Tailwind animate-* class generation)
      // -----------------------------------------------------------------------
      keyframes: {
        'slide-up-fade': {
          from: { opacity: '0', transform: 'translateY(1rem)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'slide-up': 'slide-up-fade 400ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in':  'fade-in 300ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in': 'scale-in 250ms cubic-bezier(0.16, 1, 0.3, 1) both',
      },

      // -----------------------------------------------------------------------
      // Backdrop blur — used by navbar-blur utility
      // -----------------------------------------------------------------------
      backdropBlur: {
        nav: '12px',
      },

      // -----------------------------------------------------------------------
      // Z-index scale — prevents collision between sticky/fixed elements
      // navbar:       sticky header
      // dropdown:     nav dropdowns
      // overlay:      modal backdrop
      // modal:        modal panel
      // cookie:       cookie banner (above everything except modals)
      // -----------------------------------------------------------------------
      zIndex: {
        navbar:   '50',
        dropdown: '60',
        overlay:  '70',
        modal:    '80',
        cookie:   '90',
      },

    },
  },

  plugins: [],
}

export default config
