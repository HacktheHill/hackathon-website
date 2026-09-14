import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "./tests/e2e",
	fullyParallel: false,
	workers: 1,
	timeout: 60_000,
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
	webServer: {
		command: "npm run build && npm run preview -- --host 127.0.0.1 --port 4338",
		url: "http://127.0.0.1:4338",
		reuseExistingServer: false,
		timeout: 120_000,
	},
});
