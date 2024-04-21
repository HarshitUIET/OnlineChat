/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors : {
       'white': '#ffffff',
        'black': '#000000',
        'bbblack' : 'rgba(0,0,0,0.85)',
      'ooorange' : '#ea7070'
    }
  },
  plugins: [],
}