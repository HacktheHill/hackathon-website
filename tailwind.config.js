module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			backgroundImage: {
				"square-svg": 'url("/src/assets/SVGs/square_bg.svg")',
				"pentagon-svg": 'url("/src/assets/SVGs/pentagon_bg.svg")',
				"2024-bg": 'url("/src/assets/SVGs/2024.svg")',
				"theme-gradient": `linear-gradient(45deg,
					rgba(255, 53, 53, 0.8) 0%,
					rgba(214, 26, 26, 0.8) 20%,
					rgba(169, 18, 18, 0.8) 80%,
					rgba(143, 5, 5, 0.8) 100%)`,
			},
			height: {
				gallery: "30rem",
			},
			keyframes: {
				"shake-repeat": {
					"0%, 100%": { transform: "rotate(0deg)", scale: "1.25" },
					"25%": { transform: "rotate(5deg)", scale: "1.25" },
					"50%": { transform: "rotate(-5deg)", scale: "1.25" },
					"75%": { transform: "rotate(5deg)", scale: "1.25" },
				},
				"shake-start": {
					"0%": { transform: "rotate(0deg)", scale: "1.00" },
					"25%": { transform: "rotate(5deg)", scale: "1.125" },
					"50%": { transform: "rotate(-5deg)", scale: "1.25" },
					"75%": { transform: "rotate(5deg)", scale: "1.25" },
					"100%": { transform: "rotate(0deg)", scale: "1.25" },
				},
				"shake-end": {
					"0%": { transform: "rotate(0deg)", scale: "1.25" },
					"50%": { transform: "rotate(5deg)", scale: "1.125" },
					"100%": { transform: "rotate(0deg)", scale: "1.00" },
				},
				heart: {
					"0%": { transform: "translate(0, 0) scale(1)", scale: "1.00", opacity: "1.00" },
					"20%": { transform: "translate(0, -75%)", scale: "7.50", opacity: "1.00" },
					"40%": { transform: "translate(0, -50%)", scale: "5.00", opacity: "1.00" },
					"60%": { transform: "translate(-50px, -50px) rotate(-60deg)", scale: "5.00", opacity: "0.00" },
					"80%": { transform: "translate(200%, 0)", scale: "2.50", opacity: "0.00" },
					"100%": { transform: "translate(0, 0)", scale: "1.00", opacity: "1.00" },
				},
			},
			animation: {
				"shake-rotate": "shake-start 0.5s ease-in-out 0s, shake-repeat 0.5s ease-in-out 0.5s infinite",
				"shake-end": "shake-end 0.25s ease-in-out",
				heart: "heart 3.0s ease-in-out forwards",
			},
			boxShadow: {
				"grid-card": "0px 0px 0px 1px #FF3535, 15px 15px 0px 4px rgba(255, 53, 53, 0.5)",
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
