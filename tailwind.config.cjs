/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
        info: 'rgb(var(--color-info) / <alpha-value>)',
        divider: 'rgb(var(--color-divider) / <alpha-value>)'
      },
      // backgroundImage: {
      //   'hero-pattern': "linear-gradient(to right,rgba(255, 255, 255, 0), rgba(255, 255, 255, 0),rgba(0 ,0, 0, 0.66), rgba(1, 1, 1, 1)), url('')",
      //   'hero-pattern2': "linear-gradient(to top, rgba(255, 255, 255, 0),rgba(155, 155, 155, 0), rgba(1, 1, 1, 1)), url('')"
      // },
      fontFamily: {
        lato: ['Lato']
      }
    },
    screens: {
      xs: '401px',
      sm: '681px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    }
  },
  container: {
    center: true,
    padding: '1rem'
  },
  plugins: []
}
