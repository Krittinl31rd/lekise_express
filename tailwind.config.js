/** @type {import('tailwindcss').Config} */
module.exports={
  content: [
    "./views/**/*.ejs",
    // './src/**/*.{html,js,ejs,ts,jsx,tsx}',
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
      mono: ['ui-monospace', 'SFMono-Regular'],
      poppins: ['poppins', 'poppins-Regular'],
      kanit: ['Kanit', 'serif'],
    },
    extend: {
      colors: {
        primary: '#171717',
        secondary: '#141615',
        background: '#000000'
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
        '16': '16px',
      },
      borderRadius: {
        '4xl': '16px',
      },
      keyframes: {
        fadeInDown: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
      },
      animation: {
        slideInRight: 'slideInRight 0.5s ease-out',
        slideOutRight: 'slideOutRight 0.5s ease-out',
        'fade-in-down': 'fadeInDown 0.5s ease-out',
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
  darkMode: 'class',
}

