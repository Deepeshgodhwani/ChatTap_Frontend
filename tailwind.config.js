/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/*","./src/components/*","./src/pages/*"],
  theme: {
    extend: {
      screens:{
        xs:'420px'
      }
    },
  },
  plugins: [],
}
