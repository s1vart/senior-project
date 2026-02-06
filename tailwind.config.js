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
        "violet-accent": "#7C3AED",
        "violet-light": "#8B5CF6",
        "gray-text": "#9CA3AF",
      },
    },
  },
  plugins: [],
};
