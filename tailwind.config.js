module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			backgroundImage: {
				"square-svg": 'url("/src/assets/SVGs/square_bg.svg")',
				"pentagon-svg": 'url("/src/assets/SVGs/pentagon_bg.svg")',
				"2024-bg": 'url("/src/assets/SVGs/2024.svg")',
				"mountains-svg": 'url("/src/assets/SVGs/mountains_bg.svg")',
				"parabol-svg": 'url("/src/assets/SVGs/parabol_bg.svg")',
				"blur-svg": 'url("/src/assets/patterns/ffflux.svg")',
				"union-svg": 'url("/src/assets/patterns/uuunion.svg")',
				"theme-gradient": `linear-gradient( 170deg,
					rgba(102, 9, 8, 1) 0%,
					rgba(61, 8, 5, 1) 50%,
					rgba(9, 2, 1, 1) 100%)`,
			},
			height: {
				gallery: "30rem",
			},
			maxWidth: {
				"2xl": "1536px",
				"bg-deco": "2000px",
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
				beaver: {
					//sneak out from the bottom
					"0%": { transform: "translate(0, 0)" },

					"20%": { transform: "translate(0, 25%)", rotate: "0deg" },
					"30%": { transform: "translate(0, 25%)", rotate: "5deg", scale: "1.1" },
					"40%": { transform: "translate(0, 25%)", rotate: "-5deg", scale: "1.1" },
					"50%": { transform: "translate(0, 25%)", rotate: "0deg", scale: "1.00" },

					"60%": { transform: "translate(0, 100%)" },

					"80%": { transform: "translate(0, 100%)" },

					"100%": { transform: "translate(0, 0)" },
				},
			},
			animation: {
				"shake-rotate": "shake-start 0.5s ease-in-out 0s, shake-repeat 0.5s ease-in-out 0.5s infinite",
				"shake-end": "shake-end 0.25s ease-in-out",
				heart: "heart 3.0s ease-in-out forwards",
				"sponsor-card": "sponsor-card 5.0s ease-in-out infinite",
				"sponsor-card-2": "sponsor-card 5.0s ease-in-out 1.5s infinite",
				beaver: "beaver 6.0s ease forwards",
			},
			boxShadow: {
				"grid-card": "0 0 1.5rem 0.5rem rgba(255, 53, 53, 0.5), 0 0 1.5rem 0.5rem rgba(255, 53, 53, 0.5) inset",
				glow: "rgba(255, 0, 0, 0.15) 0 0 200px 150px, rgba(255, 0, 0, 0.5) 0 0 20px 5px",
			},
		},

		colors: {
			primary: "#FF3535",
			light_accent: "#ff7979",
			dark_accent: "#551a1a",
			white: "#ffffff",
			shadow_text: "#6e7681",
			black: "#000000",
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
			"background-light": "#161b22",
			"background-dark": "#0d1117",
			button_hover: "#f0f6fc",
		},
		screens: {
			"3xl": { max: "1920px" },
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
