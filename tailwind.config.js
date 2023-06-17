// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {},
		colors: {
			...colors,
			oxford: '#0a274c',
			sunray: '#d3a95a',
			brunswick: '#1e4832'
		},
		fontFamily: {
			aileron: ['Aileron', 'ui-sans-serif']
		}
		// fontFamily: {
		// 	display: ['Gloock', 'ui-serif'],
		// 	body: ['Outfit', 'ui-sans-serif'],
		// 	btn: ['Poppins', 'ui-sans-serif']
		// }
	},
	/* To style checkboxes with form-checkbox */
	plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')]
};
