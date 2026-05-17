/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101820",
        paper: "#f7f4ed",
        matcha: "#5f8064",
        persimmon: "#c7623f",
      },
    },
  },
  plugins: [],
};
