/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{jsx, js}'],
	theme: {
		extend: {
			backgroundImage: {
				'custom-gradient':
					'linear-gradient(0deg, rgba(255,248,0,1) 21%, rgba(191,255,8,1) 43%)',
			},
			fontFamily: {
				playfair: ['"Playfair Display"', 'serif'],
				roboto: ['Roboto', 'sans-serif'],
				lora: ['Lora', 'serif'],
				ptsans: ['"PT Sans"', 'sans-serif'],
				merriweather: ['Merriweather', 'serif'],
				montserrat: ['Montserrat', 'sans-serif'],
				notosans: ['"Noto Sans"', 'sans-serif'],
			},
		},
	},
	plugins: [],
}
