import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          forest:  '#2D5016', // основной тёмно-зелёный
          gold:    '#C8A96E', // акцент — золото
          blush:   '#E8C5C5', // акцент — пудровый розовый
          cream:   '#FAF8F5', // фон страниц
          ink:     '#1A1A1A', // основной текст
        },
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Fluid type scale — значения подставляем при дизайне
        'display-xl': ['clamp(2.5rem, 6vw, 5rem)',   { lineHeight: '1.1' }],
        'display-lg': ['clamp(2rem,   4vw, 3.5rem)',  { lineHeight: '1.15' }],
        'display-md': ['clamp(1.5rem, 3vw, 2.5rem)',  { lineHeight: '1.2' }],
      },
      spacing: {
        section: '6rem',   // вертикальный отступ секций
        container: '90rem', // max-width контейнера (1440px)
      },
      borderRadius: {
        card: '1.25rem',
      },
      boxShadow: {
        card:    '0 4px 24px 0 rgba(26,26,26,0.08)',
        'card-hover': '0 8px 40px 0 rgba(26,26,26,0.14)',
      },
    },
  },
  plugins: [],
}

export default config
