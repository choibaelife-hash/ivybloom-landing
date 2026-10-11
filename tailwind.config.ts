import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          burgundy: '#7B2D3E',
          rose:     '#C9919A',
          cream:    '#FAF6F0',
          dark:     '#3D1A24',
          border:   '#E8DDD4',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans:    ['Pretendard', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [typography],
}
export default config
