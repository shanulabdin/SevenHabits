/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
    content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#222222",
        orange: '#FF6D1F',
        light: '#F5E7C6',
        lighter: '#FAF3E1',
        text: '#FFFFFF',
        dark: '#151515',
      },
    },
  },
  plugins: [],
}