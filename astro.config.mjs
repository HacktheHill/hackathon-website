import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import partytown from "@astrojs/partytown";
import { fileURLToPath } from "node:url";

const DEV = process.argv[2] === "build" ? false : true;

// https://astro.build/config
export default defineConfig({
	outDir: "build",
	site: DEV ? "http://localhost:4321" : "https://hackthehill.com",
	integrations: [react(), sitemap(), partytown()],
	vite: {
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
