/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#3b82f6',
        'primary-dark': '#1e40af',
        'primary-light': '#93c5fd',
        background: '#f8fafc',
        'background-dark': '#1e293b',
        card: '#ffffff',
        'card-hover': '#f1f5f9',
        'card-border': '#e2e8f0',
        text: '#1e293b',
        'text-light': '#64748b',
        'text-lighter': '#9ca3af',
        
        // Navbar Colors
        'navbar-bg': '#ffffff',
        'navbar-border': '#e2e8f0',
        'btn-active': '#6b7280',
        'btn-active-text': '#ffffff',
        'btn-inactive': '#e5e7eb',
        'btn-inactive-text': '#374151',
        'btn-inactive-hover': '#d1d5db',
        
        // Status Colors
        'status-error': '#ef4444',
        'status-warning': '#eab308',
        'status-success': '#22c55e',
        
        // Icon Colors
        'icon-center': '#b3b3b3',
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
}

