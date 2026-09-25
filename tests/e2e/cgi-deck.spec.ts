import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1600, height: 900 }, contextOptions: { reducedMotion: "no-preference" } });

test("CGI deck cuts in after CGI, advances all 17 pages, and cuts back to Ciena", async ({ page }, testInfo) => {
	await page.goto("/slides#cgi");
	await expect(page.locator('.slide-cgi[aria-hidden="false"]')).toBeVisible();
	const active = page.locator('.presentation-slide[aria-hidden="false"]');
	for (let number = 1; number <= 17; number++) {
		await page.keyboard.press("ArrowRight");
		await expect(page).toHaveURL(new RegExp(`#cgi-deck-${number}$`));
		await expect(active).toHaveAttribute("data-kind", "imported");
		await expect(page.locator(".slide-ribbon")).toHaveCSS("transition-duration", "0s");
		await expect(page.locator(".presentation-stage > .landscape")).toHaveCSS("transition-duration", "0s");
		const image = active.locator("img");
		await expect(image).toHaveAttribute("src", `/art/presentation/cgi-50/slide-${String(number).padStart(2, "0")}.webp`);
		await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth === 2560)).toBe(true);
		expect(await image.boundingBox()).toEqual({ x: 0, y: 0, width: 1600, height: 900 });
		if (number === 1 || number === 12) await page.screenshot({ path: testInfo.outputPath(`cgi-${number}.png`) });
	}
	await page.keyboard.press("ArrowRight");
	await expect(page).toHaveURL(/#ciena$/);
	await expect(page.locator(".slide-ribbon")).toHaveCSS("transition-duration", "0s");
	await page.keyboard.press("ArrowRight");
	await expect(page).toHaveURL(/#mlh$/);
	await expect(page.locator(".slide-ribbon")).toHaveCSS("transition-duration", "1s");
});

test("CGI deep links, reverse navigation, and letterboxing preserve the original slides", async ({ page }) => {
	await page.goto("/slides#cgi-deck-17");
	await expect(page.locator('.slide-cgi-deck-17[aria-hidden="false"]')).toBeVisible();
	await page.reload();
	await expect(page).toHaveURL(/#cgi-deck-17$/);
	await expect(page.locator('.slide-cgi-deck-17[aria-hidden="false"]')).toBeVisible();
	for (let number = 16; number >= 1; number--) {
		await page.keyboard.press("ArrowLeft");
		await expect(page).toHaveURL(new RegExp(`#cgi-deck-${number}$`));
		await expect(page.locator(".slide-ribbon")).toHaveCSS("transition-duration", "0s");
	}
	await page.setViewportSize({ width: 1440, height: 1000 });
	const image = page.locator('.slide-cgi-deck-1[aria-hidden="false"] img');
	await expect(image).toHaveCSS("object-fit", "contain");
	const box = await image.boundingBox();
	expect(box!.width / box!.height).toBeCloseTo(16 / 9, 5);
	expect(box!.x + box!.width / 2).toBeCloseTo(720, 0);
	expect(box!.y + box!.height / 2).toBeCloseTo(500, 0);
	await page.keyboard.press("ArrowLeft");
	await expect(page).toHaveURL(/#cgi$/);
	await expect(page.locator(".slide-ribbon")).toHaveCSS("transition-duration", "0s");
});
