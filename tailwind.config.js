/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Google colors
        google: {
          blue: '#1a73e8',
          'blue-light': '#4285f4',
          'blue-hover': '#1557b0',
          red: '#ea4335',
          yellow: '#fbbc04',
          green: '#34a853',
          gray: '#5f6368',
          'gray-light': '#9aa0a6',
          'gray-dark': '#3c4043',
          'gray-bg': '#f8f9fa',
          'gray-hover': '#f1f3f4',
        },
        // Neutral system
        neutral: {
          25: '#fcfcfd',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Primary system
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
      },
      fontFamily: {
        sans: ['Google Sans', 'Roboto', 'Arial', 'sans-serif'],
        display: ['Google Sans Display', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'google-headline': ['22px', { lineHeight: '28px', fontWeight: '400' }],
        'google-subhead': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'google-body': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'google-caption': ['12px', { lineHeight: '16px', fontWeight: '400' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'google': '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)',
        'google-lg': '0 1px 3px 0 rgba(60,64,67,.3), 0 4px 8px 3px rgba(60,64,67,.15)',
      },
    },
  },
  plugins: [],
}