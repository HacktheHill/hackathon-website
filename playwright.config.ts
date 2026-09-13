import { defineConfig } from "@playwright/test";

const parity = process.env.PARITY === "1";

export default defineConfig({
	testDir: parity ? "./tests/parity" : "./tests/e2e",
	fullyParallel: false,
	workers: 1,
	timeout: parity ? 120_000 : 60_000,
	reporter: "line",
	projects: [
		{
			name: "chromium",
			use: { browserName: "chromium" },
		},
		{
			name: "firefox",
			use: { browserName: "firefox" },
		},
	],
	use: {
		baseURL: "http://127.0.0.1:4338",
		screenshot: "only-on-failure",
	},
	// Parity uses two separately built servers, including an untouched main checkout.
	webServer: parity
		? undefined
		: {
				command: "npm run build && npm run preview -- --host 127.0.0.1 --port 4338",
				url: "http://127.0.0.1:4338",
				reuseExistingServer: false,
				timeout: 120_000,
		  },
});
