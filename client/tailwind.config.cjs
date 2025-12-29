/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef9ff",
          100: "#d7edff",
          200: "#a5d6ff",
          300: "#6cb9ff",
          400: "#3494ff",
          500: "#1d72f3",
          600: "#1557d0",
          700: "#1345a8",
          800: "#123a84",
          900: "#102f66"
        }
      }
    }
  },
  plugins: []
};
