/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#10B981", // Emerald 500
                secondary: "#F59E0B", // Amber 500
                dark: "#111827", // Gray 900
            }
        },
    },
    plugins: [],
}
