/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: [
                    'Montserrat',
                    'ui-sans-serif',
                    'system-ui',
                    '-apple-system',
                    'Segoe UI',
                    'Roboto',
                    'sans-serif',
                ],
                // System stack for the printable card: html-to-image renders
                // it without fetching web fonts, so export matches the screen.
                card: [
                    'ui-sans-serif',
                    'system-ui',
                    '-apple-system',
                    'Segoe UI',
                    'Roboto',
                    'Arial',
                    'sans-serif',
                ],
            },
            colors: {
                // Science ID green — matches the printed card artwork.
                brand: {
                    50: '#ecfdf3',
                    100: '#d1fadf',
                    200: '#a6f4c5',
                    300: '#6ce9a6',
                    400: '#32d583',
                    500: '#12b76a',
                    600: '#039855',
                    700: '#027a48',
                    800: '#05603a',
                    900: '#054f31',
                },
                // Deep navy surfaces that sit on top of the background video.
                ink: {
                    600: '#2a4064',
                    700: '#1c3050',
                    800: '#11213a',
                    900: '#0a1628',
                    950: '#050b18',
                },
                scan: {
                    DEFAULT: '#38bdf8',
                    soft: '#7dd3fc',
                },
            },
            boxShadow: {
                panel: '0 24px 64px -24px rgba(2, 6, 23, 0.75)',
                card: '0 18px 40px -16px rgba(2, 6, 23, 0.6)',
            },
            keyframes: {
                'fade-up': {
                    from: { opacity: '0', transform: 'translateY(12px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                'scan-line': {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100%)' },
                },
            },
            animation: {
                'fade-up': 'fade-up 0.45s cubic-bezier(0.22, 1, 0.36, 1) both',
                'scan-line': 'scan-line 2.4s ease-in-out infinite alternate',
            },
        },
    },
    plugins: [],
};
