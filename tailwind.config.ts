import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './views/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0052cc',
          hover: '#0041a3',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f2f4f7',
          hover: '#e5e7eb',
          foreground: '#111827',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
