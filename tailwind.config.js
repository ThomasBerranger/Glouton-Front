/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        './src/**/*.{vue,js,ts,jsx,tsx}',
        "./node_modules/tw-elements/dist/js/**/*.js"
    ],
    theme: {
        fontFamily: {
            title: ['Moirai One', 'cursive'],
        },
        extend: {},
    },
    plugins: [require("tw-elements/dist/plugin.cjs")]
}

