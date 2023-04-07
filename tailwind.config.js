/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	daisyui: {
		themes: [
			{
				morelli: {
					primary: '#13A89E',
					secondary: '#3A2319',
					accent: '#C96C00',
					neutral: '#222D3A',
					'base-100': '#d6d3d1',
					info: '#81B6D5',
					success: '#19A982',
					warning: '#EECD59',
					error: '#F86D7F'
				}
			}
		]
	},
	plugins: [require('daisyui')]
};
