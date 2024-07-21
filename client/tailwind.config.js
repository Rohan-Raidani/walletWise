/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'back-dark':'#424242',
      'back-light':'#616161',
      'text-o':'#FF5722',
      'text-g':'#E0E0E0',

    },
    
    extend: {
      
    },
    fontFamily: {
      'Serif': ["PT Serif", "serif"]
    },
  },
  plugins: [],
}

