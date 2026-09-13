import { expect, test } from "@playwright/test";

test("copy remains selectable through foreground artwork", async ({ page }) => {
	for (const viewport of [
		{ width: 390, height: 844 },
		{ width: 1440, height: 900 },
	]) {
		await page.setViewportSize(viewport);
		await page.goto("/");
		const copy = page.locator("#about p").first();
		await copy.scrollIntoViewIfNeeded();
		await copy.click({ clickCount: 3 });
		expect(await page.evaluate(() => getSelection()?.toString().trim())).not.toBe("");
		await expect(page.locator("[data-scene-artwork]")).toHaveCSS("pointer-events", "none");

		if (viewport.width < 1025) {
			await expect(page.locator('[data-hero-layer="foreground"]')).toHaveCSS("pointer-events", "none");
		}
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
