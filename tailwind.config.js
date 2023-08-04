/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class", '[data-bs-theme="dark"]'],
	content: ["./src/**/*.{html,js}"],
	theme: {
		extend: {
			zIndex: {
				100: "100",
			},
		},
	},
	safelist: [
		{ pattern: /^\-?m(\w?)-/ },
		{ pattern: /^p(\w?)-/ },
		{ pattern: /^text-/, variants: ["dark", "hover", "focus", "dark:hover", "dark:focus", "disabled"] },
		{ pattern: /^bg-/, variants: ["dark", "hover", "focus", "dark:hover", "dark:focus", "disabled"] },
	],
	plugins: [],
};
