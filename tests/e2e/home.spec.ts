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
		await expect(page.locator("astro-island[ssr]")).toHaveCount(0);
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

test("current sponsors and collaborators render in the approved order", async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto("/");

	await expect(page.getByRole("heading", { name: "Sponsors", exact: true })).toBeVisible();
	await expect(page.getByRole("heading", { name: "Collaborators", exact: true })).toBeVisible();

	const sponsorCards = page.locator("[data-sponsor-card]");
	await expect(sponsorCards).toHaveCount(4);
	expect(await sponsorCards.first().getAttribute("data-sponsor-tier")).toBe("largest");
	expect(await sponsorCards.nth(1).getAttribute("data-sponsor-tier")).toBe("large");
	expect(await sponsorCards.nth(2).getAttribute("data-sponsor-tier")).toBe("small");
	expect(await sponsorCards.nth(3).getAttribute("data-sponsor-tier")).toBe("small");
	expect(
		await sponsorCards
			.locator('img:not([aria-hidden="true"])')
			.evaluateAll(images => images.map(image => image.getAttribute("alt"))),
	).toEqual(["CGI logo", "Ciena logo", "ElevenLabs logo", "Backboard logo"]);
	await expect(sponsorCards.locator('img[aria-hidden="true"]')).toHaveCount(4);

	const sponsorWidths = await sponsorCards.evaluateAll(cards =>
		cards.map(card => card.getBoundingClientRect().width),
	);
	expect(sponsorWidths[0]).toBeCloseTo(sponsorWidths[1] ?? 0, 0);
	expect(sponsorWidths[1]).toBeGreaterThan(sponsorWidths[2]);
	expect(sponsorWidths[2]).toBeCloseTo(sponsorWidths[3] ?? 0, 0);

	await expect(page.locator("[data-collaborator-card]")).toHaveCount(8);
	expect(
		await page
			.locator("[data-collaborator-card] img")
			.evaluateAll(images => images.map(image => image.getAttribute("alt"))),
	).toEqual([
		"uOttawa logo",
		"Engineering Students' Society logo",
		"Engineering Endowment Fund logo",
		"IEEE uOttawa logo",
		"Software Engineering Students' Association logo",
		"UOSU logo",
		"uODPA APNuO logo",
		"Carleton AI Society logo",
	]);
});
