/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        themeyellow: "#f5d30d",
        themegreen: "#00b000",
        themegreen2:"#00cc00",
        themered:"#FF0000",
      }
    },
  },
  plugins: [],
}