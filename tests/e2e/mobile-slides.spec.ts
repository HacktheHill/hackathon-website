import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, contextOptions: { reducedMotion: "reduce" } });

for (const [route, start, next] of [
	["slides", "opening", "tonight"],
	["closing", "closing", "programme"],
]) {
	test(`${route}: mobile tap advances once and mouse click does not`, async ({ page }) => {
		await page.goto(`/${route}#${start}`);
		await page.waitForFunction(() => !document.querySelector("astro-island[ssr]"));
		await page.mouse.click(200, 100);
		await expect(page).toHaveURL(new RegExp(`#${start}$`));
		await page.touchscreen.tap(200, 100);
		await expect(page).toHaveURL(new RegExp(`#${next}$`));
	});
}

test("mobile taps reveal winners and preserve links", async ({ page }) => {
	await page.goto("/closing#foss");
	await page.waitForFunction(() => !document.querySelector("astro-island[ssr]"));
	await page.touchscreen.tap(200, 100);
	await expect(page).toHaveURL(/#foss\/winner$/);
	await page.touchscreen.tap(200, 100);
	await expect(page).toHaveURL(/#ui-ux$/);
	await page.goto("/closing#join-ctn");
	await page.waitForFunction(() => !document.querySelector("astro-island[ssr]"));
	await page
		.locator(".slide-join-ctn a")
		.evaluate(el => el.addEventListener("click", event => event.preventDefault()));
	await page.locator(".slide-join-ctn a").tap();
	await expect(page).toHaveURL(/#join-ctn$/);
});

test("opening navigation buttons advance only once on touch", async ({ page }) => {
	await page.goto("/slides#opening");
	await page.waitForFunction(() => !document.querySelector("astro-island[ssr]"));
	await page.locator(".presentation-controls button").last().tap();
	await expect(page).toHaveURL(/#tonight$/);
});
