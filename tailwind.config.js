/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false, // Disable dark mode - only light Astra theme
  theme: {
    extend: {
      colors: {
        // New Astra LT Brand Colors
        'primary-blue': {
          DEFAULT: '#0057B8',
          50: '#e6f2ff',
          100: '#b3d9ff',
          200: '#80c0ff',
          300: '#4da7ff',
          400: '#1a8eff',
          500: '#0057B8',
          600: '#004a9e',
          700: '#003d82',
          800: '#003066',
          900: '#002349',
          950: '#001a33',
        },
        'accent-orange': {
          DEFAULT: '#F28C00',
          50: '#fff8e6',
          100: '#ffecb3',
          200: '#ffe080',
          300: '#ffd44d',
          400: '#ffc81a',
          500: '#F28C00',
          600: '#d47600',
          700: '#b66200',
          800: '#984e00',
          900: '#7a3a00',
          950: '#5c2600',
        },
        'neutral-dark': {
          DEFAULT: '#333333',
          50: '#f7f7f7',
          100: '#e8e8e8',
          200: '#d0d0d0',
          300: '#b8b8b8',
          400: '#a0a0a0',
          500: '#888888',
          600: '#666666',
          700: '#4d4d4d',
          800: '#333333',
          900: '#1a1a1a',
          950: '#0d0d0d',
        },
        'neutral-light': {
          DEFAULT: '#F5F5F5',
          50: '#ffffff',
          100: '#fafafa',
          200: '#F5F5F5',
          300: '#ebebeb',
          400: '#e0e0e0',
          500: '#d6d6d6',
          600: '#cccccc',
          700: '#c2c2c2',
          800: '#b8b8b8',
          900: '#adadad',
          950: '#a3a3a3',
        },
        'highlight-green': {
          DEFAULT: '#00A34A',
          50: '#e6f7ed',
          100: '#b3e8cb',
          200: '#80d9a9',
          300: '#4dca87',
          400: '#1abb65',
          500: '#00A34A',
          600: '#008a3e',
          700: '#007132',
          800: '#005826',
          900: '#003f1a',
          950: '#00260e',
        },
        // Legacy colors for compatibility
        astra: {
          deep: '#0057B8',     // Maps to primary-blue
          medium: '#337fd6',   // Maps to primary-blue-300
          soft: '#F28C00',     // Maps to accent-orange
          light: '#F5F5F5',    // Maps to neutral-light
          white: '#ffffff',    // Pure white
          // Keep old names for compatibility during transition
          dark: '#0057B8',     // Alias for primary-blue
          cyan: '#F28C00',     // Alias for accent-orange
          primary: '#0057B8',  // Alias for primary-blue
          secondary: '#F28C00', // Alias for accent-orange
          accent: '#337fd6',   // Alias for primary-blue-300
          lightgray: '#F5F5F5', // Alias for neutral-light
        },
      },
      fontFamily: {
        sans: ['Inter var', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'astra-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'astra-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'astra-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'astra-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
