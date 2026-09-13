import { expect, test } from "@playwright/test";

test("particle modes change only for newly spawned particles", async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 720 });
	await page.goto("/");

	await page.locator("#about").scrollIntoViewIfNeeded();
	await expect(page.locator('[aria-hidden="true"][data-mode="leaves"]')).toBeAttached();
	await expect.poll(() => page.locator('img[src*="/leaf-"]').count()).toBeGreaterThan(0);
	const existingLeaves = await page.locator('img[src*="/leaf-"]').count();

	await page.locator("#testimonials").scrollIntoViewIfNeeded();
	await expect(page.locator('[aria-hidden="true"][data-mode="snow"]')).toBeAttached();
	await expect.poll(() => page.locator('img[src*="/snow-"]').count()).toBeGreaterThan(0);
	await expect(page.locator('img[src*="/leaf-"]')).toHaveCount(existingLeaves);
	await expect(page.locator('[aria-hidden="true"][data-mode] img').first()).toHaveCSS(
		"animation-iteration-count",
		"1",
	);
	await expect.poll(() => page.locator('img[src*="/leaf-"]').count(), { timeout: 6_000 }).toBe(0);

	await page.locator("#about").scrollIntoViewIfNeeded();
	await expect(page.locator('[aria-hidden="true"][data-mode="leaves"]')).toBeAttached();
	await expect.poll(() => page.locator('img[src*="/leaf-"]').count()).toBeGreaterThan(0);
	await page.evaluate(() => {
		document.documentElement.style.scrollBehavior = "auto";
		window.scrollTo(0, 0);
	});
	await expect(page.locator('[aria-hidden="true"][data-mode="none"]')).toBeAttached();
	await expect.poll(() => page.locator('img[src*="/leaf-"]').count(), { timeout: 1_500 }).toBe(0);

	await page.locator("#testimonials").scrollIntoViewIfNeeded();
	await expect(page.locator('[aria-hidden="true"][data-mode="snow"]')).toBeAttached();
	await expect.poll(() => page.locator('img[src*="/snow-"]').count()).toBeGreaterThan(0);
	await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
	await expect(page.locator('[aria-hidden="true"][data-mode="bubbles"]')).toBeAttached();
	await expect.poll(() => page.locator('img[src*="/snow-"]').count(), { timeout: 1_500 }).toBe(0);
});

test("reduced motion disables animated particles", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.goto("/");
	await page.locator("#about").scrollIntoViewIfNeeded();
	await expect(page.locator('[aria-hidden="true"][data-mode="none"]')).toBeAttached();
});

test("bubble highlights remain oriented toward the shared light source", async ({ page }) => {
	await page.goto("/");
	await page.locator("#faq").scrollIntoViewIfNeeded();
	const field = page.locator('[data-mode="bubbles"]');
	await expect(field).toBeAttached();
	const bubbles = field.locator("img");
	await expect.poll(() => bubbles.count(), { timeout: 8_000 }).toBeGreaterThanOrEqual(6);

	const orientations = await bubbles.evaluateAll(elements =>
		elements.slice(0, 6).map(element => getComputedStyle(element).rotate),
	);
	expect(orientations).toEqual(["0deg", "-45deg", "-45deg", "15deg", "20deg", "0deg"]);
});
