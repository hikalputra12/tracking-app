/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      colors: {
        notion: {
          bg: '#ffffff',
          darkBg: '#191919',
          sidebar: '#fbfbfa',
          darkSidebar: '#202020',
          border: '#e9e9e7',
          darkBorder: '#2f2f2f',
          hover: '#efefee',
          darkHover: '#2a2a2a',
          text: '#37352f',
          darkText: '#e6e5e3',
          muted: '#787774',
          darkMuted: '#9b9a97',
          // Notion Pill Colors
          pillGray: '#f1f1ef',
          pillBrown: '#f3eeee',
          pillOrange: '#f8ece3',
          pillYellow: '#fbf3db',
          pillGreen: '#edf3ec',
          pillBlue: '#e7f3f8',
          pillPurple: '#f4eff7',
          pillPink: '#f9f0f5',
          pillRed: '#fdebec',
        }
      }
    },
  },
  plugins: [],
}
