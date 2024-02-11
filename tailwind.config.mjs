import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {},
		colors: {
			white: colors.white,
			blue: colors.blue,
			red: colors.red,
			gray: colors.gray,
			black: colors.black,
			oxford: '#0a274c',
			sunray: '#d3a95a',
			brunswick: '#1e4832',
		},
		fontFamily: {
			aileron: ['Aileron', 'ui-sans-serif'],
			riot: ['RiotSquad', 'ui-serif'],
			gotham: ['Gotham', 'ui-sans-serif'],
		},
		// fontFamily: {
		// 	display: ['Gloock', 'ui-serif'],
		// 	body: ['Outfit', 'ui-sans-serif'],
		// 	btn: ['Poppins', 'ui-sans-serif']
		// }
	},
	/* To style checkboxes with form-checkbox */
	plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
