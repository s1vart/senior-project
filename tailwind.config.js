/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "dark-bg": "#1C1C1E",
        "dark-card": "#2C2C2E",
        "dark-border": "#3A3A3C",
        "sage-accent": "#6B8F71",
        "sage-light": "#7DA383",
        "gray-text": "#9CA3AF",
      },
    },
  },
  plugins: [],
};
