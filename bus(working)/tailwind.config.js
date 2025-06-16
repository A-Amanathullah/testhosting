/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {

      colors:{
        primary:"#991c1f",
        secondary: "#63625e",
      },

      container:{
        center:true,
        padding:{
          DEFAULT: '1rem',
          sm:'2rem',
          lg:'4rem',
          xl:'5rem',
          '2xl':'6rem',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

