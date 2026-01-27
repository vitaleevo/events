/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                champagne: '#fdfbf7',
                gold: '#c5a059',
                'gold-dark': '#a37e3c',
                stone: {
                    50: '#fafaf9',
                    100: '#f5f5f4',
                    200: '#e7e5e4',
                    300: '#d6d3d1',
                    400: '#a8a29e',
                    500: '#78716c',
                    600: '#57534e',
                    700: '#44403c',
                    800: '#292524',
                    900: '#1c1917',
                }
            },
            fontFamily: {
                sans: ['var(--font-inter)'],
                serif: ['var(--font-playfair)'],
            },
            backgroundImage: {
                'gold-gradient': 'linear-gradient(135deg, #c5a059 0%, #a37e3c 100%)',
            },
            animation: {
                'fade-in': 'fade-in 0.8s ease-out forwards',
                'fade-in-up': 'fade-in-up 1s ease-out forwards',
                'slow-pan': 'slow-pan 30s linear infinite alternate',
                'shimmer': 'shimmer 2.5s linear infinite',
            },
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'slow-pan': {
                    '0%': { transform: 'scale(1.05) translate(0, 0)' },
                    '100%': { transform: 'scale(1.15) translate(-2%, -2%)' },
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                }
            }
        },
    },
    plugins: [],
}
