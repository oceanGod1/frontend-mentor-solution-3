/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html", "**/*.{html,js"],
  theme: {
    extend: {
      fontFamily: {
        main: ['Kumbh Sans', 'sans-serif']
      },
      colors: {
        primary: 'hsl(26, 100%, 55%)',
        primaryLight: 'hsl(25, 99%, 73%)',
        secondary: 'hsl(220, 13%, 13%)',
        secondaryLight: 'hsl(219, 9%, 45%)',
        backup: 'hsl(223, 64%, 98%)',
        neutral1: 'hsl(0, 0%, 100%)',
        neutral2: 'hsl(0, 0%, 0%)',
        neutral2Light: '#000000b3',
      },
      boxShadow: {
        'custom-shadow': '0 2rem 2rem hsla(26, 100%, 55%, 0.302)',
      }
    },
  },
  plugins: [],
}


// - Black (with 75% opacity for lightbox background): hsl(0, 0%, 0%)