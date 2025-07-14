import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            // You can define custom colors, fonts, and other theme properties here
            // to match your SaaS brand identity.
            colors: {
                'primary': '#4f46e5',
                'secondary': '#10b981',
                'background': '#111827',
                'surface': '#1f2937',
                'text-primary': '#f9fafb',
                'text-secondary': '#d1d5db',
            }
        },
    },
    plugins: [],
}
export default config
