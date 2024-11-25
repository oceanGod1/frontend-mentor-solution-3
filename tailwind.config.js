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
        primaryLight: 'hsl(26, 100%, 55%)',
        secondary: 'hsl(220, 13%, 13%)',
        secondaryDark: 'hsl(219, 9%, 45%)',
        backup: 'hsl(223, 64%, 98%)',
        neutral1: 'hsl(0, 0%, 100%)',
        neutral2: 'hsl(0, 0%, 0%)',
        // neutral2Trans: hsl(0, 0%, 0%)
      },
    },
  },
  plugins: [],
}




// ### Primary

// - Orange: hsl(26, 100%, 55%)
// - Pale orange: hsl(25, 100%, 94%)

// ### Neutral

// - Very dark blue: hsl(220, 13%, 13%)
// - Dark grayish blue: hsl(219, 9%, 45%)
// - Grayish blue: hsl(220, 14%, 75%)
// - Light grayish blue: hsl(223, 64%, 98%)
// - White: hsl(0, 0%, 100%)
// - Black (with 75% opacity for lightbox background): hsl(0, 0%, 0%)