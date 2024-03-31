module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			backgroundImage: {
				"square-svg": 'url("/src/assets/SVGs/square_bg.svg")',
				"2024-bg": 'url("/src/assets/SVGs/2024.svg")',
			},
			height: {
                section: "90vh",
            },
			keyframes: {
				"shake-repeat": {
					"0%, 100%": { transform: "rotate(0deg)" , scale: "1.25" },
					"25%": { transform: "rotate(5deg)" , scale: "1.25" },
					"50%": { transform: "rotate(-5deg)" , scale: "1.25" },
					"75%": { transform: "rotate(5deg)" , scale: "1.25" },
				},
				"shake-start": {
					"0%": { transform: "rotate(0deg)" , scale: "1.00" },
					"25%": { transform: "rotate(5deg)" , scale: "1.125" },
					"50%": { transform: "rotate(-5deg)" , scale: "1.25" },
					"75%": { transform: "rotate(5deg)" , scale: "1.25" },
					"100%": { transform: "rotate(0deg)" , scale: "1.25" },
				},
			},
			animation: {
				"shake-rotate": "shake-start 1.0s ease-in-out 0s forwards, shake-repeat 1.0s ease-in-out 1.0s infinite",
			},
		},

		colors: {
			primary: "#FF3535",
			light_accent: "#ff7979",
			dark_accent: "#551a1a",
			"shade-1": "#ebebeb",
			"shade-2": "#e0e0e0",
			"shade-3": "#bdbdbd",
			"shade-4": "#9e9e9e",
			"shade-5": "#757575",
			"shade-6": "#616161",
			"shade-7": "#424242",
			"shade-8": "#212121",
			"shade-9": "#171717",
			"shade-10": "#090909",
			navbar: "#212121a9",
			"bg-2024": "#84010b",
		},
		screens: {
			"2xl": { max: "1536px" },
			xl: { max: "1280px" },
			lg: { max: "1024px" },
			md: { max: "768px" },
			sm: { max: "640px" },
			xs: { max: "480px" },
		},
	},
	plugins: [],
};
