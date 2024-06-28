/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			animation: {
				'text-gradient': 'text-gradient 1.5s linear infinite',
			},
			keyframes: {
				'text-gradient': {
					to: {
						backgroundPosition: '200% center',
					},
				},
			},
		},
		animation: {
			'background-shine': 'background-shine 2s linear infinite',
		},
		keyframes: {
			'background-shine': {
				from: {
					backgroundPosition: '0 0',
				},
				to: {
					backgroundPosition: '-200% 0',
				},
			},
		},
	},
	plugins: [],
};
