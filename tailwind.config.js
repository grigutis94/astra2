/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        astra: {
          deep: '#395E89',     // Deep Blue - primary color for headers, buttons
          medium: '#5C8DA3',   // Medium Blue - backgrounds, bridges
          soft: '#8CC3C5',     // Soft Teal - accents, interactive elements  
          light: '#B3E0D8',    // Light Teal - card backgrounds, sections
          white: '#F1F7F8',    // Off-White - main background
          // Keep old names for compatibility during transition
          dark: '#395E89',     // Alias for deep
          cyan: '#8CC3C5',     // Alias for soft
          primary: '#395E89',  // Alias for deep
          secondary: '#8CC3C5', // Alias for soft
          accent: '#5C8DA3',   // Alias for medium
          lightgray: '#F1F7F8', // Alias for white
        },
      },
      fontFamily: {
        sans: ['Inter var', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
