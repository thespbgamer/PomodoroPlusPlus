/** @type {import('tailwindcss').Config} */
module.exports = {
	plugins: [require("flowbite/plugin")],
	darkMode: ["class", '[data-bs-theme="dark"]'],
	content: ["./src/**/*.{html,js}"],
	theme: {
		extend: {},
	},
	plugins: [],
};
