module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5', // Example primary color
        secondary: '#3B82F6', // Example secondary color
      },
      spacing: {
        '128': '32rem', // Custom spacing
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem', // Custom border radius
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'], // Enable disabled state for opacity
      cursor: ['disabled'], // Enable disabled state for cursor
    },
  },
  plugins: [],
};