const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{html,js,vue}"],
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
    require('tailwind-scrollbar'),
    require('tailwind-scrollbar-hide')
  ],
}