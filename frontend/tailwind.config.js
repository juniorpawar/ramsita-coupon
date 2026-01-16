/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#2563eb',
                    dark: '#1e40af',
                    light: '#3b82f6'
                },
                success: {
                    DEFAULT: '#10b981',
                    dark: '#059669',
                    light: '#34d399'
                },
                warning: {
                    DEFAULT: '#f59e0b',
                    dark: '#d97706',
                    light: '#fbbf24'
                },
                error: {
                    DEFAULT: '#ef4444',
                    dark: '#dc2626',
                    light: '#f87171'
                }
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'scan-line': 'scanLine 2s ease-in-out infinite'
            },
            keyframes: {
                scanLine: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(100%)' }
                }
            }
        },
    },
    plugins: [],
}
