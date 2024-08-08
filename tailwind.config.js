/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        rubik: ["Rubik", "sans-serif"],
      },
      colors: {
        primary: "#22223b",
        secondary: "#f1faee",
      },
    },
    screens: {
      "2xl": { max: "1535px" }, // Extra large screens and down
      xl: { max: "1440px" }, // Large screens and down
      lg: { max: "1024px" }, // Medium screens and down
      md: { max: "768px" }, // Small screens and down
      sm: { max: "500px" }, // Extra small screens and down
    },
  },
};
