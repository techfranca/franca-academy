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
          green: {
            light: '#f2fcf4',
            'light-active': '#d7f5dc',
            DEFAULT: '#7de08d',
            hover: '#71ca7f',
            dark: '#5ea86a',
            'dark-hover': '#4b8655',
            darker: '#2c4e31',
          },
          navy: {
            light: '#e6e8eb',
            'light-active': '#b2b6c0',
            DEFAULT: '#081534',
            hover: '#07132f',
            dark: '#061027',
            'dark-hover': '#050d1f',
            darker: '#030712',
          },
          sage: '#598F74',
        },
      },
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'],
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
      },
      fontSize: {
        'heading-1': ['54px', { lineHeight: '1.1', fontWeight: '700' }],
        'heading-2': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'heading-3': ['24px', { lineHeight: '1.3', fontWeight: '500' }],
        'heading-4': ['24px', { lineHeight: '1.3', fontWeight: '400' }],
        'body-big': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-bold': ['16px', { lineHeight: '1.6', fontWeight: '700' }],
        'body-small': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-small-bold': ['14px', { lineHeight: '1.5', fontWeight: '700' }],
        'caption': ['32px', { lineHeight: '1.4', fontWeight: '300' }],
        'callout': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'overline': ['16px', { lineHeight: '1.4', fontWeight: '600' }],
      },
    },
  },
  plugins: [],
}

export default config
