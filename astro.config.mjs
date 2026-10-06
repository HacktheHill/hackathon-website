import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import partytown from "@astrojs/partytown";
import { fileURLToPath } from "node:url";

const DEV = process.argv[2] !== "build";

// Wrangler's local server uses its own origin. Preserve the browser's
// same-origin check at the proxy boundary before translating that origin.
const photoDevProxy = {
	target: "http://127.0.0.1:8787",
	changeOrigin: true,
	configure(proxy) {
		proxy.on("proxyReq", (proxyRequest, request) => {
			const origin = request.headers.origin;
			const host = request.headers.host;
			if (host && origin === `http://${host}`) {
				proxyRequest.setHeader("origin", "http://127.0.0.1:8787");
			}
		});
	},
};

// https://astro.build/config
export default defineConfig({
	outDir: "build",
	site: DEV ? "http://localhost:4321" : "https://hackthehill.com",
	integrations: [react(), sitemap(), partytown()],
	vite: {
		server: {
			proxy: {
				"/photos/api": photoDevProxy,
				"/photos/media": photoDevProxy,
				"/photos/download": photoDevProxy,
			},
		},
		optimizeDeps: {
			include: ["react-dom/client"],
		},
		resolve: {
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url)),
			},
		},
	},
});
