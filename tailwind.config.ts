import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#111827',
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        surface: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-noto-sans-devanagari)', 'sans-serif'],
        devanagari: ['var(--font-noto-sans-devanagari)', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            fontFamily: 'var(--font-noto-sans-devanagari), var(--font-inter), sans-serif',
            lineHeight: '1.9',
            color: '#1f2937',
            maxWidth: 'none',
            p: { marginBottom: '1.2em' },
            'h2, h3, h4': { fontWeight: '700', color: '#111827' },
            blockquote: {
              borderLeftColor: '#dc2626',
              backgroundColor: '#fff5f5',
              paddingLeft: '1rem',
              paddingRight: '1rem',
              paddingTop: '0.25rem',
              paddingBottom: '0.25rem',
              borderRadius: '0 0.5rem 0.5rem 0',
              fontStyle: 'normal',
            },
            'blockquote p': { color: '#7f1d1d' },
            a: { color: '#dc2626', textDecoration: 'none' },
            'a:hover': { textDecoration: 'underline' },
            strong: { color: '#111827' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
