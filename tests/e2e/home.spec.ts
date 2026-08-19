import { expect, test } from "@playwright/test";

const viewports = [
	{ name: "phone", width: 320, height: 568 },
	{ name: "tablet", width: 768, height: 1024 },
	{ name: "desktop", width: 1440, height: 900 },
	{ name: "short-landscape", width: 844, height: 390 },
];

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
	await expect(page.locator("[data-page-canvas]")).toHaveCSS("background-image", /linear-gradient/);
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
	await expect(page.locator('picture:has([data-hero-layer="hill1"]) source')).toHaveAttribute("sizes", "max(242.10vh, 104.24vw)");
	await expect(page.locator('picture:has([data-hero-layer="hill2"]) source')).toHaveAttribute("sizes", "max(235.10vh, 101.22vw)");
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

test("FAQ uses keyboard-accessible native accordions", async ({ page }) => {
	await page.goto("/");
	const questions = page.locator("#faq details");
	await questions.first().locator("summary").click();
	await expect(questions.first()).toHaveAttribute("open", "");
	await questions.nth(1).locator("summary").click();
	await expect(questions.first()).toHaveAttribute("open", "");
	await expect(questions.nth(1)).toHaveAttribute("open", "");
});

for (const viewport of viewports) {
	test(`${viewport.name} layout has no horizontal overflow`, async ({ page }) => {
		await page.setViewportSize(viewport);
		await page.goto("/");
		await expect(page.locator("main")).toBeVisible();
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
		);
		expect(overflow).toBeLessThanOrEqual(1);
	});
}

test("French content reflows without overflow", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/");
	await page.getByRole("button", { name: /FR:/ }).click();
	await expect(page.locator("html")).toHaveAttribute("lang", "fr");
	await expect(page.getByRole("heading", { name: "Foire aux questions" })).toBeVisible();
	const overflow = await page.evaluate(
		() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
	);
	expect(overflow).toBeLessThanOrEqual(1);
});

test("mobile sections do not overlap", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/");
	const boxes = await page
		.locator("#hero, #about, #stats, #testimonials, #sponsors, #collaborators, #faq, footer")
		.evaluateAll(elements =>
			elements
				.map(element => {
					const box = element.getBoundingClientRect();
					return { top: box.top, bottom: box.bottom };
				})
				.sort((left, right) => left.top - right.top),
		);
	for (let index = 1; index < boxes.length; index += 1) {
		expect(boxes[index].top).toBeGreaterThanOrEqual(boxes[index - 1].bottom - 1);
	}
});

test("mobile hero copy clears navigation and stays in view", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/");
	const [badge, heading, apply] = await Promise.all([
		page.locator("#mlh-trust-badge").boundingBox(),
		page.locator("#hero h1").boundingBox(),
		page.getByRole("link", { name: "Apply Now" }).boundingBox(),
	]);
	expect(badge).not.toBeNull();
	expect(heading).not.toBeNull();
	expect(apply).not.toBeNull();
	expect(heading!.y).toBeGreaterThanOrEqual(badge!.y + badge!.height + 16);
	expect(heading!.x).toBeGreaterThanOrEqual(0);
	expect(heading!.x + heading!.width).toBeLessThanOrEqual(390);
	expect(apply!.x + apply!.width).toBeLessThanOrEqual(390);
});

test("header remains in document flow and scrolls with the page", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/");
	const navbar = page.locator("nav").first();
	const badge = page.locator("#mlh-trust-badge");
	await expect(navbar).toBeInViewport();
	await expect(badge).toBeVisible();
	await expect(navbar).toHaveCSS("position", "static");
	await expect(navbar).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
	await navbar.locator('[href="#hero"]').click();
	await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThanOrEqual(1);
	await page.evaluate(() => scrollTo({ top: 1600, behavior: "instant" }));
	await expect(navbar).not.toBeInViewport();
	await expect(badge).not.toBeInViewport();
	await expect(navbar).not.toHaveAttribute("data-hidden");
	await expect(navbar).not.toHaveAttribute("data-floating");
});

test("header only exposes persistent controls", async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto("/");
	const navbar = page.locator("nav").first();
	const badge = page.locator("#mlh-trust-badge");
	await expect(navbar.locator("ul")).toHaveCount(0);
	await expect(navbar.locator('[href="#hero"]')).toBeVisible();
	await expect(navbar.locator("button")).toHaveText("FR");
	await expect(navbar.locator('[href="https://2024.hackthehill.com"]')).toBeVisible();
	await expect(badge).toBeVisible();
	await expect(badge).toHaveAttribute("href", /utm_campaign=2027-season/);
	await expect(badge.locator("img")).toHaveAttribute("alt", /2027 Hackathon Season/);

	await page.evaluate(() => scrollTo({ top: 1600, behavior: "instant" }));
	await expect(navbar).not.toBeInViewport();
	await expect(badge).not.toBeInViewport();
});

test("navbar controls keep the same order and alignment across breakpoints", async ({ page }) => {
	for (const viewport of [
		{ width: 390, height: 844 },
		{ width: 1440, height: 900 },
	]) {
		await page.setViewportSize(viewport);
		await page.goto("/");
		const controls = await page
			.locator("[data-navigation-home], nav button[aria-label], #mlh-trust-badge")
			.evaluateAll(elements =>
				elements
					.filter(element => element.getClientRects().length > 0)
					.map(element => {
						const box = element.getBoundingClientRect();
						return { x: box.x, top: box.y };
					}),
			);
		expect(controls.map(control => control.x)).toEqual(
			[...controls.map(control => control.x)].sort((a, b) => a - b),
		);
		expect(controls).toHaveLength(3);
		expect(Math.abs(controls[0].top - controls[2].top)).toBeLessThanOrEqual(1);
		expect(controls[1].top).toBeGreaterThanOrEqual(controls[0].top);
		expect(controls[1].top).toBeLessThanOrEqual(controls[0].top + 24);
	}
});

test("mobile interactive controls meet touch target guidance", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/");
	for (const selector of [
		"#testimonials button",
		"footer a[aria-label]",
		"#sponsors a",
		"#collaborators a",
		"nav button[aria-label]",
	]) {
		const sizes = await page.locator(selector).evaluateAll(elements =>
			elements.map(element => {
				const box = element.getBoundingClientRect();
				return { width: box.width, height: box.height };
			}),
		);
		for (const size of sizes) {
			expect(size.width).toBeGreaterThanOrEqual(44);
			expect(size.height).toBeGreaterThanOrEqual(44);
		}
	}
});

test("carousel controls change the selected testimonial", async ({ page }) => {
	await page.goto("/");
	const pressed = page.locator('#testimonials button[aria-pressed="true"]');
	await expect(pressed).toHaveAttribute("aria-label", /1:/);
	const carousel = page.locator("#testimonials [aria-live]");
	await carousel.focus();
	await carousel.press("ArrowRight");
	await expect(pressed).toHaveAttribute("aria-label", /2:/);
	await page.locator("#testimonials button").last().click();
	await expect(pressed).toHaveAttribute("aria-label", /3:/);
});

test("mobile carousel clips adjacent slides", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/");
	const carousel = page.locator("#testimonials [aria-live]");
	await carousel.scrollIntoViewIfNeeded();
	const portrait = page.locator('#testimonials [role="group"]').first().locator("img");
	const portraitBox = await portrait.boundingBox();
	expect(portraitBox).not.toBeNull();
	expect(Math.abs((portraitBox?.width ?? 0) - (portraitBox?.height ?? 0))).toBeLessThan(1);

	const assertSingleVisibleSlide = async () => {
		const visibleSlides = await page.locator('#testimonials [role="group"]').evaluateAll(slides => {
			const viewport = slides[0]?.parentElement?.parentElement?.getBoundingClientRect();
			if (!viewport) return 0;
			return slides.filter(slide => {
				const box = slide.getBoundingClientRect();
				return box.right > viewport.left && box.left < viewport.right;
			}).length;
		});
		expect(visibleSlides).toBe(1);
	};

	await assertSingleVisibleSlide();
	await page.locator("#testimonials button").last().click();
	await expect(page.locator('#testimonials [role="group"]').first()).toHaveCSS("visibility", "visible");
	await page.waitForTimeout(500);
	await expect(page.locator('#testimonials [role="group"]').first()).toHaveCSS("visibility", "hidden");
	await assertSingleVisibleSlide();
});

test("carousel supports keyboard arrows and swipe", async ({ page }) => {
	await page.goto("/");
	const carousel = page.locator("#testimonials [aria-live]");
	const pressed = page.locator('#testimonials button[aria-pressed="true"]');
	await carousel.focus();
	await carousel.press("ArrowRight");
	await expect(pressed).toHaveAttribute("aria-label", /2:/);

	await carousel.dispatchEvent("pointerdown", {
		pointerId: 1,
		isPrimary: true,
		clientX: 300,
		clientY: 200,
	});
	await carousel.dispatchEvent("pointerup", {
		pointerId: 1,
		isPrimary: true,
		clientX: 100,
		clientY: 200,
	});
	await expect(pressed).toHaveAttribute("aria-label", /3:/);
});

test("desktop keyboard order includes persistent header controls", async ({ page }) => {
	await page.goto("/");
	const focused: string[] = [];
	for (let index = 0; index < 5; index += 1) {
		await page.keyboard.press("Tab");
		focused.push(
			await page.evaluate(
				() =>
					document.activeElement?.getAttribute("href") ??
					document.activeElement?.getAttribute("aria-label") ??
					"",
			),
		);
	}
	expect(focused[0]).toBe("#main-content");
	expect(focused[1]).toBe("#hero");
	expect(focused[3]).toBe("https://2024.hackthehill.com");
	expect(focused[4]).toContain("mlh.io");
});

test("countdown opens on hover and restores focus after keyboard dismissal", async ({ page }) => {
	await page.addInitScript(() => {
		Date.now = () => new Date("2026-08-15T12:00:00-04:00").getTime();
	});
	await page.goto("/");
	const hotspot = page.locator('#hero button[aria-haspopup="dialog"]');
	await expect(hotspot).toBeAttached();
	const dialog = page.locator("#countdown-dialog");
	await hotspot.hover({ force: true });
	await expect(dialog).toHaveJSProperty("open", true);
	await page.mouse.move(1, 1);
	await expect(dialog).toHaveJSProperty("open", false);
	await hotspot.focus();
	await hotspot.press("Enter");
	await expect(dialog).toHaveJSProperty("open", true);
	await page.keyboard.press("Escape");
	await expect(dialog).toHaveJSProperty("open", false);
	await expect(hotspot).toBeFocused();
});

test("reduced motion disables animated particles", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.goto("/");
	await page.locator("#about").scrollIntoViewIfNeeded();
	await expect(page.locator('[aria-hidden="true"][data-mode="none"]')).toBeAttached();
});
