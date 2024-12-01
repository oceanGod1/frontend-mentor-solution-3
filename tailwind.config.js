/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html", "app.js"],
  theme: {
    extend: {
      fontFamily: {
        main: ["Kumbh Sans", "sans-serif"],
      },

      colors: {
        primary: "hsl(26, 100%, 55%)",
        primaryLight: "hsl(25, 99%, 73%)",
        secondary: "hsl(220, 13%, 13%)",
        secondaryLight: "hsl(219, 9%, 45%)",
        backup: "hsl(223, 64%, 98%)",
        neutral1: "hsl(0, 0%, 100%)",
        neutral2: "hsl(0, 0%, 0%)",
        neutral2Light: "#000000b3",
      },

      boxShadow: {
        "custom-shadow": "0 2rem 2rem hsla(26, 100%, 55%, 0.302)",
      },

      backgroundImage: {
        "default-image": "url('images/image-product-1.jpg')",
      },

      filter: {
        "white-filter": "invert(100%) brightness(200%)",
        "primary-filter":
          "invert(60%) sepia(90%) saturate(500%) hue-rotate(0deg) brightness(95%) contrast(100%)",
      },
      position: {
        "left-end": "100%"
      }
    },
  },
  plugins: [require("tailwindcss-filters")],
};

