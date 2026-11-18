/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{tsx,ts,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        "sky-light": "#C9EFFB",
        "cream": "#FFF8EB",
        sand: "#F4D58D",
        terracotta: "#C86B4A",
        burgundy: "#8E2638",
        "warm-orange": "#D99B3E",
        ink: "#332329",
        "muted-ink": "#80675D",
      },
      fontFamily: {
        display: ["Libre Baskerville", "serif"],
        sans: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
