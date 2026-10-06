import { expect, test } from "@playwright/test";

const pixel =
	'<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1067"><rect width="1600" height="1067" fill="red"/></svg>';
test.beforeEach(async ({ page }) => {
	await page.route("https://photos.hackthehill.com/**", route =>
		route.fulfill({ contentType: "image/svg+xml", body: pixel }),
	);
});

test("photo carousel navigates by button and keyboard, with full framing at mobile and desktop widths", async ({
	page,
}) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	for (const width of [390, 1440]) {
		await page.setViewportSize({ width, height: 900 });
		await page.goto("/#gallery");
		await page.locator("#gallery").scrollIntoViewIfNeeded();
		const gallery = page.locator("#gallery");
		await expect(gallery.locator("img")).toHaveAttribute("src", /photo=821c3c1abf7c754dd95a$/);
		await gallery.getByRole("button", { name: "Next photo" }).click();
		await expect(gallery.locator("img")).toHaveAttribute("src", /photo=909b40f1abd42c5e2537$/);
		await gallery.getByRole("button", { name: "Next photo" }).press("ArrowLeft");
		await expect(gallery.locator("img")).toHaveAttribute("src", /photo=821c3c1abf7c754dd95a$/);
		expect(await gallery.locator("img").evaluate(image => getComputedStyle(image).objectFit)).toBe("contain");
		expect(
			await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
		).toBeLessThanOrEqual(0);
		await expect(gallery.getByRole("button", { name: "Pause", exact: true })).toHaveCount(0);
	}
	await page.getByRole("button", { name: /^FR:/ }).click();
	await expect(page.locator("#gallery img")).toHaveAttribute("alt", /Les coprésidents/);
	await expect(page.locator("#gallery a")).toHaveText("Voir l’album photo");
});

test("rotation waits for visibility and load, can be paused, and stops after manual navigation", async ({ page }) => {
	await page.clock.install();
	await page.goto("/");
	const gallery = page.locator("#gallery");
	await page.clock.runFor(9000);
	await expect(gallery.locator("img")).toHaveAttribute("src", /photo=821c3c1abf7c754dd95a$/);
	await gallery.scrollIntoViewIfNeeded();
	await page.mouse.move(0, 0);
	await expect
		.poll(() =>
			gallery.locator("img").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0),
		)
		.toBe(true);
	await page.clock.runFor(8500);
	await expect(gallery.locator("img")).toHaveAttribute("src", /photo=909b40f1abd42c5e2537$/);
	await gallery.getByRole("button", { name: "Pause", exact: true }).click();
	const pausedSrc = await gallery.locator("img").getAttribute("src");
	await page.clock.runFor(16000);
	await expect(gallery.locator("img")).toHaveAttribute("src", pausedSrc!);
	await gallery.getByRole("button", { name: "Next photo" }).click();
	await expect(gallery.getByRole("button", { name: "Play", exact: true })).toBeVisible();
});

test("a removed or unavailable highlight is skipped", async ({ page }) => {
	await page.route("https://photos.hackthehill.com/*photo=821c3c1abf7c754dd95a", route =>
		route.fulfill({ status: 404 }),
	);
	await page.goto("/#gallery");
	await page.locator("#gallery").scrollIntoViewIfNeeded();
	await expect(page.locator("#gallery img")).toHaveAttribute("src", /photo=909b40f1abd42c5e2537$/);
});
