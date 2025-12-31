/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        'primary-dark': '#1e40af',
        background: '#f8fafc',
        'background-dark': '#1e293b',
        card: '#ffffff',
        'card-hover': '#f1f5f9',
        text: '#1e293b',
        'text-light': '#64748b',
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
}

