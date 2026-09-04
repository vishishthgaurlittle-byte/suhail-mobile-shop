/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A0A0A',
        accent: '#FF3B30',
        secondary: '#0071E3',
        surface: '#F5F5F7',
      },
      fontFamily: {
        rubik: ['Rubik', 'sans-serif'],
        sans: ['Rubik', 'sans-serif'],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      }
    },
  },
  plugins: [],
}
