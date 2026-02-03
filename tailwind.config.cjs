/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Keep brand colors for backward compatibility
        'brand': {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        // New dark theme colors
        'dark': {
          950: '#030712',
          900: '#0a0f1a',
          800: '#111827',
          700: '#1f2937',
          600: '#374151',
        },
        // Accent (cyan) palette
        'accent': {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        // Violet palette
        'violet': {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        // Rose palette
        'rose': {
          400: '#fb7185',
          500: '#f43f5e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Responsive display sizes
        'display-xl': ['clamp(3rem, 8vw, 5rem)', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg': ['clamp(2.5rem, 6vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['clamp(2rem, 5vw, 3rem)', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-sm': ['clamp(1.75rem, 4vw, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-slower': 'float 10s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'morph': 'morph 8s ease-in-out infinite',
        'aurora': 'aurora 25s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1deg)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        morph: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40%/50% 60% 30% 60%' },
        },
        aurora: {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '33%': { transform: 'rotate(120deg) scale(1.05)' },
          '66%': { transform: 'rotate(240deg) scale(0.95)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
