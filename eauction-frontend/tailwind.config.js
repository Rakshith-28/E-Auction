/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb",
          dark: "#1d4ed8",
        },
        secondary: "#10b981",
        accent: "#f59e0b",
        surface: "#f8fafc",
      },
    },
  },
  plugins: [],
};
