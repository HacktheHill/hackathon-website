import { expect, test } from "@playwright/test";

const image =
	'<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1067"><rect width="1600" height="1067" fill="red"/></svg>';
test.beforeEach(async ({ page }) => {
	await page.route("https://photos.hackthehill.com/**", route =>
		route.fulfill({ contentType: "image/svg+xml", body: image }),
	);
});
const active = (page: import("@playwright/test").Page) => page.locator('#gallery figure[aria-hidden="false"] img');

test("photos use arrows, dots and keyboard navigation, with full framing and bilingual captions", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	for (const width of [390, 511, 768, 1440]) {
		await page.setViewportSize({ width, height: 900 });
		await page.goto("/#gallery");
		await expect(page.locator("astro-island[ssr]")).toHaveCount(0);
		const gallery = page.locator("#gallery");
		await expect(active(page)).toHaveAttribute("src", /photo=821c3c1abf7c754dd95a$/);
		await gallery.getByRole("button", { name: "Next photo", exact: true }).click();
		await expect(active(page)).toHaveAttribute("src", /photo=909b40f1abd42c5e2537$/);
		const viewport = gallery.getByRole("region");
		await viewport.press("ArrowLeft");
		await expect(active(page)).toHaveAttribute("src", /photo=821c3c1abf7c754dd95a$/);
		expect(await active(page).evaluate(img => getComputedStyle(img).objectFit)).toBe("contain");
		expect(
			await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
		).toBeLessThanOrEqual(0);
		const boxes = await gallery
			.locator("button")
			.evaluateAll(buttons =>
				buttons.map(button => ({
					width: button.getBoundingClientRect().width,
					height: button.getBoundingClientRect().height,
				})),
			);
		for (const box of boxes) {
			expect(box.width).toBeGreaterThanOrEqual(44);
			expect(box.height).toBeGreaterThanOrEqual(44);
		}
		await expect(gallery.locator("a")).toHaveCount(0);
		await expect(gallery.getByRole("button", { name: "Pause", exact: true })).toHaveCount(0);
	}
	await page.getByRole("button", { name: /^FR:/ }).click();
	await expect(active(page)).toHaveAttribute("alt", /Les coprésidents/);
});

test("photo carousel wraps smoothly and responds to horizontal swipes", async ({ page }) => {
	await page.goto("/#gallery");
	await expect(page.locator("astro-island[ssr]")).toHaveCount(0);
	const gallery = page.locator("#gallery");
	const dots = gallery.locator("button[aria-pressed]");
	const track = gallery.locator("[aria-live] > div");
	await dots.last().click();
	await expect(dots.last()).toHaveAttribute("aria-pressed", "true");
	await expect(track).not.toHaveAttribute("data-moving", "");
	await gallery.getByRole("button", { name: "Next photo", exact: true }).click();
	await expect(dots.first()).toHaveAttribute("aria-pressed", "true");
	await expect(track).not.toHaveAttribute("data-moving", "");
	await expect(track).toHaveAttribute("style", /-100%/);
	const viewport = gallery.getByRole("region");
	await viewport.dispatchEvent("pointerdown", { pointerId: 2, isPrimary: true, clientX: 300, clientY: 200 });
	await viewport.dispatchEvent("pointermove", { pointerId: 2, isPrimary: true, clientX: 220, clientY: 200 });
	await viewport.dispatchEvent("pointerup", { pointerId: 2, isPrimary: true, clientX: 100, clientY: 200 });
	await expect(dots.nth(1)).toHaveAttribute("aria-pressed", "true");
});

test("removed previews are skipped, including errors before hydration", async ({ page }) => {
	await page.route("https://photos.hackthehill.com/*photo=821c3c1abf7c754dd95a", route =>
		route.fulfill({ status: 404 }),
	);
	await page.goto("/#gallery");
	await page.locator("#gallery").scrollIntoViewIfNeeded();
	await expect(active(page)).toHaveAttribute("src", /photo=909b40f1abd42c5e2537$/);
	await expect(page.locator("#gallery button[aria-pressed]")).toHaveCount(7);
});
