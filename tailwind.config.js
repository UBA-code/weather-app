/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
		colors:{
			'light-blue-bg-from': "#46afcf",
			'light-blue-bg-to': "#6abad3",
			'orange-bg-from': "#f5d177",
			'orange-bg-to': "#f29f85",
			'hard-blue-from': "#2f5071",
			'hard-blue-bg-to': "#494075",
			'white-txt': '#c6cfd4',
		},
	},
  },
  plugins: [],
}

