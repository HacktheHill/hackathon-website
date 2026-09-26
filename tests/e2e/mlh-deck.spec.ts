import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1600, height: 900 }, contextOptions: { reducedMotion: "no-preference" } });

test("Down enters all 27 MLH slides and hard-cuts back to collaborators", async ({ page }, testInfo) => {
	await page.goto("/slides#mlh");
	await expect(page.locator('.slide-mlh[aria-hidden="false"]')).toBeVisible();
	const active = page.locator('.presentation-slide[aria-hidden="false"]');
	for (let number = 1; number <= 27; number++) {
		await page.keyboard.press("ArrowDown");
		await expect(page).toHaveURL(new RegExp(`#mlh-deck-${number}$`));
		await expect(active).toHaveAttribute("data-kind", "imported");
		await expect(page.locator(".slide-ribbon")).toHaveCSS("transition-duration", "0s");
		const image = active.locator("img");
		await expect(image).toHaveAttribute("src", `/art/presentation/mlh-opening/slide-${String(number).padStart(2, "0")}.webp`);
		await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth === 2560)).toBe(true);
		expect(await image.boundingBox()).toEqual({ x: 0, y: 0, width: 1600, height: 900 });
		if (number === 1 || number === 16) await page.screenshot({ path: testInfo.outputPath(`mlh-${number}.png`) });
	}
	await page.keyboard.press("ArrowDown");
	await expect(page).toHaveURL(/#partners$/);
	await expect(page.locator(".slide-ribbon")).toHaveCSS("transition-duration", "0s");
	await page.keyboard.press("ArrowUp");
	await expect(page).toHaveURL(/#mlh-deck-27$/);
});

for (const key of ["0", "Numpad0"]) {
	test(`${key} on the MLH welcome skips the optional deck without changing other slides`, async ({ page }) => {
		await page.goto("/slides#mlh");
		await expect(page.locator('.slide-mlh[aria-hidden="false"]')).toBeVisible();
		await page.keyboard.press(key);
		await expect(page).toHaveURL(/#partners$/);
		await expect(page.locator('.slide-partners[aria-hidden="false"]')).toBeVisible();
		await expect(page.locator(".slide-ribbon")).toHaveCSS("transition-duration", "0s");
		await expect(page.locator('[data-kind="imported"][aria-hidden="false"]')).toHaveCount(0);
		await expect(page.locator('.imported-slide-video')).toHaveCount(0);
		await page.keyboard.press(key);
		await expect(page).toHaveURL(/#partners$/);
		await page.keyboard.press("ArrowDown");
		await expect(page).toHaveURL(/#challenges$/);
		await expect(page.locator(".challenge-view")).toHaveAttribute("data-stage", "0");
		await page.goto("/slides#ciena");
		await expect(page.locator('.slide-ciena[aria-hidden="false"]')).toBeVisible();
		await page.keyboard.press(key);
		await expect(page).toHaveURL(/#ciena$/);
	});
}

test("MLH deep links and backward navigation work, and zero does not skip from inside the deck", async ({ page }) => {
	await page.goto("/slides#mlh-deck-2");
	await expect(page.locator('.slide-mlh-deck-2[aria-hidden="false"]')).toBeVisible();
	await page.reload();
	await expect(page.locator('.slide-mlh-deck-2[aria-hidden="false"]')).toBeVisible();
	await page.keyboard.press("0");
	await expect(page).toHaveURL(/#mlh-deck-2$/);
	await page.keyboard.press("ArrowUp");
	await expect(page).toHaveURL(/#mlh-deck-1$/);
	await page.keyboard.press("ArrowUp");
	await expect(page).toHaveURL(/#mlh$/);
	await page.keyboard.press("0");
	await expect(page).toHaveURL(/#partners$/);
});

test("the Gemini video plays on entry, holds at the end, and restarts after leaving", async ({ page }, testInfo) => {
	await page.goto("/slides#mlh-deck-22");
	await expect(page.locator('.slide-mlh-deck-22[aria-hidden="false"]')).toBeVisible();
	await expect(page.locator(".imported-slide-video video")).toHaveCount(0);
	await page.keyboard.press("ArrowDown");
	await expect(page).toHaveURL(/#mlh-deck-23$/);
	const video = page.locator(".imported-slide-video video");
	await expect(video).toBeVisible();
	await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime > 0.2 && !v.paused)).toBe(true);
	const metadata = await video.evaluate((v: HTMLVideoElement) => ({ duration: v.duration, width: v.videoWidth, height: v.videoHeight }));
	expect(metadata.width).toBe(1920);
	expect(metadata.height).toBe(970);
	expect(metadata.duration).toBeGreaterThan(67);
	expect(metadata.duration).toBeLessThan(68);
	await page.screenshot({ path: testInfo.outputPath("mlh-gemini-video.png") });
	await video.evaluate((v: HTMLVideoElement) => { v.currentTime = v.duration - 0.3; });
	await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.ended)).toBe(true);
	await expect(page).toHaveURL(/#mlh-deck-23$/);
	const previous = await video.elementHandle();
	await page.keyboard.press("ArrowDown");
	await expect(page).toHaveURL(/#mlh-deck-24$/);
	await expect(video).toHaveCount(0);
	expect(await previous!.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
	await page.keyboard.press("ArrowUp");
	await expect(video).toBeVisible();
	await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime > 0 && v.currentTime < 5 && !v.paused)).toBe(true);
	// Advancing during playback also stops the detached video immediately.
	const playing = await video.elementHandle();
	await page.keyboard.press("ArrowDown");
	await expect(video).toHaveCount(0);
	expect(await playing!.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
});
