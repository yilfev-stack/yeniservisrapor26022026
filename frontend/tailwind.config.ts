import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#f4f6fb',
        foreground: '#0f172a',
        card: '#ffffff',
        muted: '#e5e7eb',
        'muted-foreground': '#6b7280',
        primary: '#2563eb',
        border: '#e5e7eb'
      },
      borderRadius: {
        xl: '0.9rem',
        '2xl': '1rem'
      }
    }
  },
  plugins: []
} satisfies Config
