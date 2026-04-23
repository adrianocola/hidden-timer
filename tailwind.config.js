/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#141414',
        border: '#848484',
        ui: {
          button: '#d4d4d4',
          buttonDisabled: '#a4a4a4',
          disabled: '#848484',
          text: '#d4d4d4',
          icon: '#141414',
        }
      }
    },
  },
  plugins: [],
}

