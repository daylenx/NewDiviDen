/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Solarized Light
        'solarized-base3': '#fdf6e3',    // Background
        'solarized-base2': '#eee8d5',    // Secondary background
        'solarized-base1': '#93a1a1',    // Comments/Secondary content
        'solarized-base0': '#839496',    // Body text/default
        'solarized-base00': '#657b83',   // Optional emphasized content
        'solarized-base01': '#586e75',   // Optional emphasized content
        'solarized-base02': '#073642',   // Background highlights
        'solarized-base03': '#002b36',   // Background

        // Solarized Accents
        'solarized-yellow': '#b58900',
        'solarized-orange': '#cb4b16',
        'solarized-red': '#dc322f',
        'solarized-magenta': '#d33682',
        'solarized-violet': '#6c71c4',
        'solarized-blue': '#268bd2',
        'solarized-cyan': '#2aa198',
        'solarized-green': '#859900',
      },
    },
  },
  plugins: [],
} 