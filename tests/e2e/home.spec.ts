import { expect, test } from "@playwright/test";

const viewports = [
	{ name: "phone", width: 320, height: 568 },
	{ name: "tablet", width: 768, height: 1024 },
	{ name: "desktop", width: 1440, height: 900 },
	{ name: "short-landscape", width: 844, height: 390 },
	{ name: "below-carousel-breakpoint", width: 510, height: 844 },
	{ name: "above-carousel-breakpoint", width: 511, height: 844 },
	{ name: "below-phone-breakpoint", width: 600, height: 900 },
	{ name: "above-phone-breakpoint", width: 601, height: 900 },
	{ name: "responsive-canvas-limit", width: 1024, height: 900 },
	{ name: "desktop-canvas-start", width: 1025, height: 900 },
];

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
	for (const viewport of [
		{ width: 390, height: 844 },
		{ width: 768, height: 1024 },
		{ width: 1025, height: 900 },
	]) {
		await page.setViewportSize(viewport);
		await page.goto("/");
		await page.getByRole("button", { name: /FR:/ }).click();
		await expect(page.locator("html")).toHaveAttribute("lang", "fr");
		await expect(page.getByRole("heading", { name: "Foire aux questions" })).toBeVisible();
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
		);
		expect(overflow).toBeLessThanOrEqual(1);
	}
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
