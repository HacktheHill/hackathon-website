import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1600, height: 900 }, contextOptions: { reducedMotion: "reduce" } });

test("controls skip imported CGI slides and respect deck boundaries", async ({ page }) => {
	await page.goto("/slides#cgi");
	const previous = page.getByRole("button", { name: "Previous slide" });
	const next = page.getByRole("button", { name: "Next slide" });
	await expect(page.locator('.slide-cgi[aria-hidden="false"]')).toBeVisible();
	await expect(page.locator('img[src*="cgi-50"]')).toHaveCount(0);
	await next.click();
	await expect(page).toHaveURL(/#ciena$/);
	await previous.click();
	await expect(page).toHaveURL(/#cgi$/);
	await page.keyboard.press("Home");
	await expect(previous).toBeDisabled();
	await next.focus();
	await page.keyboard.press("Enter");
	await expect(page).toHaveURL(/#tonight$/);
	await previous.focus();
	await page.keyboard.press("Space");
	await expect(page).toHaveURL(/#opening$/);
	await page.keyboard.press("End");
	await expect(next).toBeDisabled();
	await expect(previous).toBeEnabled();
	for (const viewport of [
		{ width: 1600, height: 900 },
		{ width: 390, height: 844 },
	]) {
		await page.setViewportSize(viewport);
		const controls = await page.getByRole("navigation", { name: "Slide navigation" }).boundingBox();
		expect(controls!.x).toBe(16);
		expect(controls!.y + controls!.height).toBe(viewport.height - 16);
	}
});

test("controls retrace staged slides and remain clickable over video and black slides", async ({ page }) => {
	await page.goto("/slides#guidelines");
	const previous = page.getByRole("button", { name: "Previous slide" });
	const next = page.getByRole("button", { name: "Next slide" });
	await expect(page.locator('.slide-guidelines[aria-hidden="false"]')).toBeVisible();
	await next.click();
	await expect(page.locator('.venue-sign-face[aria-hidden="false"]').first()).toHaveAttribute("lang", "fr");
	await previous.click();
	await expect(page.locator('.venue-sign-face[aria-hidden="false"]').first()).toHaveAttribute("lang", "en");
	await page.goto("/slides#schedule");
	await expect(page.locator('.slide-schedule[aria-hidden="false"]')).toBeVisible();
	await next.click();
	await expect(page.locator(".schedule")).toHaveAttribute("data-event", "2");
	await previous.click();
	await expect(page.locator(".schedule")).toHaveAttribute("data-event", "1");
	await page.goto("/slides#blackout");
	await expect(page.locator(".presentation-blackout")).toBeVisible();
	await next.click();
	await expect(page).toHaveURL(/#blackout-1$/);
	await next.click();
	await expect(page).toHaveURL(/#blackout-2$/);
	await previous.click();
	await expect(page).toHaveURL(/#blackout-1$/);
});
