import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './modules/**/*.{js,ts,jsx,tsx,mdx}',
        './shared/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
                display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
                mono: ['var(--font-jetbrains-mono)', 'monospace'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            colors: {
                slate: {
                    50: 'var(--theme-slate-50)',
                    100: 'var(--theme-slate-100)',
                    200: 'var(--theme-slate-200)',
                    300: 'var(--theme-slate-300)',
                    400: 'var(--theme-slate-400)',
                    500: 'var(--theme-slate-500)',
                    600: 'var(--theme-slate-600)',
                    700: 'var(--theme-slate-700)',
                    800: 'var(--theme-slate-800)',
                    900: 'var(--theme-slate-900)',
                    950: 'var(--theme-slate-950)',
                },
            },
        },
    },
    plugins: [],
}
export default config
