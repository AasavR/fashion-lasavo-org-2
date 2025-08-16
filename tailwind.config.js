/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        couture: { gold: "#c8a75f", ink: "#0b0b0b", pearl: "#f7f6f3" }
      },
      boxShadow: { couture: "0 12px 40px rgba(0,0,0,0.18)" }
    }
  },
  plugins: []
};
