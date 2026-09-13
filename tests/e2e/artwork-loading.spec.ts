import { expect, test } from "@playwright/test";

test("scene artwork has a themed fallback and uses viewport-aware loading", async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	let releaseSceneImages!: () => void;
	const sceneImagesReleased = new Promise<void>(resolve => {
		releaseSceneImages = resolve;
	});
	let noteSceneImageRequest!: () => void;
	const sceneImageRequested = new Promise<void>(resolve => {
		noteSceneImageRequest = resolve;
	});
	await page.route("**/art/scene/**", async route => {
		noteSceneImageRequest();
		await sceneImagesReleased;
		await route.continue();
	});
	await page.goto("/", { waitUntil: "domcontentloaded" });
	await sceneImageRequested;
	await expect(page.locator("html")).toHaveCSS("background-color", "rgb(132, 1, 11)");
	const artwork = page.locator("[data-scene-artwork]");
	await expect(artwork).not.toHaveAttribute("data-scene-ready", /.+/);
	await expect(artwork).toHaveCSS("visibility", "visible");
	releaseSceneImages();
	await expect(page.locator('[data-scene-layer="sky"]')).toHaveAttribute("loading", "eager");
	await expect(page.locator('[data-scene-layer="sky"]')).toHaveAttribute("decoding", "sync");
	await expect(page.locator('[data-scene-layer="sky"]')).toHaveAttribute("fetchpriority", "high");
	await expect(page.locator('[data-scene-layer="sky"]')).toHaveAttribute("width", "3049");
	const skySource = page.locator('picture:has([data-scene-layer="sky"]) source');
	await expect(skySource).toHaveAttribute(
		"srcset",
		/\/art\/scene\/responsive\/1280\/sky\.webp 1280w.*\/responsive\/1920\/sky\.webp 1920w.*\/art\/scene\/sky\.webp 3049w/,
	);
	await expect(skySource).toHaveAttribute("sizes", "(min-width: 3049px) 3049px, 100.0000vw");
	await expect
		.poll(() =>
			page.locator('[data-scene-layer="sky"]').evaluate(element => (element as HTMLImageElement).currentSrc),
		)
		.toContain("/art/scene/responsive/1920/sky.webp");
	expect(
		await page
			.locator("[data-hero-layer]")
			.evaluateAll(elements => elements.map(element => (element as HTMLImageElement).currentSrc)),
	).toEqual(Array(10).fill(""));
	const loadingByLayer = await page.locator("[data-scene-layer]").evaluateAll(elements =>
		elements.map(element => ({
			name: element.getAttribute("data-scene-layer"),
			loading: element.getAttribute("loading"),
		})),
	);
	expect(loadingByLayer.filter(layer => layer.loading === "eager").map(layer => layer.name)).toEqual([
		"sky",
		"cloud-1",
		"cloud-2",
		"cloud-3",
		"cloud-4",
		"cloud-5",
		"cloud-6",
		"hill-near",
		"hill-far",
		"parliament-tower",
		"parliament-roof",
		"parliament-towers",
		"bush-1",
		"bush-2",
	]);
	expect(loadingByLayer.filter(layer => layer.loading === "lazy")).toHaveLength(9);
	await expect(page.locator('[data-scene-layer="bush-3"]')).toHaveAttribute("decoding", "async");

	await page.setViewportSize({ width: 390, height: 844 });
	await page.reload();
	const mobileSources = await page
		.locator("[data-scene-layer]")
		.evaluateAll(elements => elements.map(element => (element as HTMLImageElement).currentSrc));
	expect(new Set(mobileSources)).toEqual(new Set([""]));
});

test("mobile hero keeps its warm fallback while artwork is pending", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	const requestedWebps: string[] = [];
	let releaseHeroImages!: () => void;
	const heroImagesReleased = new Promise<void>(resolve => {
		releaseHeroImages = resolve;
	});
	let noteHeroImageRequest!: () => void;
	const heroImageRequested = new Promise<void>(resolve => {
		noteHeroImageRequest = resolve;
	});
	await page.route("**/*.webp", async route => {
		requestedWebps.push(new URL(route.request().url()).pathname);
		noteHeroImageRequest();
		await heroImagesReleased;
		await route.continue();
	});

	await page.goto("/", { waitUntil: "domcontentloaded" });
	await heroImageRequested;
	await expect(page.locator("section#hero")).toHaveCSS("background-image", /linear-gradient/);
	await expect(page.locator("section#hero")).not.toHaveCSS("background-color", "rgb(6, 18, 56)");

	releaseHeroImages();
	await page.waitForLoadState("load");
	await expect(page.locator('[data-hero-layer="sky"]')).toHaveAttribute("loading", "eager");
	await expect(page.locator('[data-hero-layer="sky"]')).toHaveAttribute("decoding", "auto");
	const skySource = page.locator('picture:has([data-hero-layer="sky"]) source');
	await expect(skySource).toHaveAttribute(
		"srcset",
		/\/art\/hero\/responsive\/480\/sky\.webp 480w.*\/responsive\/768\/sky\.webp 768w.*\/responsive\/1024\/sky\.webp 1024w.*\/responsive\/1280\/sky\.webp 1280w/,
	);
	await expect(skySource).toHaveAttribute("sizes", "max(100vw, 166.11svh)");
	await expect(page.locator('picture:has([data-hero-layer="hill1"]) source')).toHaveAttribute(
		"sizes",
		"max(242.10vh, 104.24vw)",
	);
	await expect(page.locator('picture:has([data-hero-layer="hill2"]) source')).toHaveAttribute(
		"sizes",
		"max(235.10vh, 101.22vw)",
	);
	await expect
		.poll(() =>
			page.locator('[data-hero-layer="sky"]').evaluate(element => (element as HTMLImageElement).currentSrc),
		)
		.toMatch(/^.*\/_astro\/sky\.[^/]+\.webp$/);
	const loadedMobileLayers = await page
		.locator("[data-hero-layer]")
		.evaluateAll(elements =>
			elements
				.filter(element => (element as HTMLImageElement).currentSrc !== "")
				.map(element => element.getAttribute("data-hero-layer")),
		);
	expect(loadedMobileLayers).toEqual(["sky", "cloud6", "hill2", "hill1", "foreground"]);
	const selectedForeground = new URL(
		await page
			.locator('[data-hero-layer="foreground"]')
			.evaluate(element => (element as HTMLImageElement).currentSrc),
	).pathname;
	expect(selectedForeground).toMatch(/^\/art\/hero\/responsive\/(480|768|1024|1280)\/foreground\.webp$/);
	expect(requestedWebps.filter(path => path.includes("foreground"))).toEqual([selectedForeground]);
	expect(requestedWebps.some(path => path.startsWith("/art/particles/"))).toBe(false);
});
