import { expect, test } from "@playwright/test";

const viewports = [
	{ name: "phone", width: 320, height: 568 },
	{ name: "tablet", width: 768, height: 1024 },
	{ name: "desktop", width: 1440, height: 900 },
	{ name: "short-landscape", width: 844, height: 390 },
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
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/");
	await page.getByRole("button", { name: /FR:/ }).click();
	await expect(page.locator("html")).toHaveAttribute("lang", "fr");
	await expect(page.getByRole("heading", { name: "Foire aux questions" })).toBeVisible();
	const overflow = await page.evaluate(
		() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
	);
	expect(overflow).toBeLessThanOrEqual(1);
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

test("navbar scrolls with the document", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/");
	const navbar = page.locator("nav").first();
	const initialBox = await navbar.boundingBox();
	expect(initialBox).not.toBeNull();
	await page.evaluate(() => scrollTo(0, 200));
	const scrolledBox = await navbar.boundingBox();
	expect(scrolledBox).not.toBeNull();
	expect(scrolledBox!.y).toBeLessThan(initialBox!.y - 150);
});

test("navbar controls keep the same order and alignment across breakpoints", async ({ page }) => {
	for (const viewport of [
		{ width: 390, height: 844 },
		{ width: 1440, height: 900 },
	]) {
		await page.setViewportSize(viewport);
		await page.goto("/");
		const controls = await page
			.locator('[data-navigation-home], nav button[aria-label], #mlh-trust-badge')
			.evaluateAll(elements =>
				elements.map(element => {
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
		await expect(page.locator("nav").first().locator('a[href^="#"]')).toHaveCount(1);
	}
});

test("mobile interactive controls meet touch target guidance", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/");
	for (const selector of ["#testimonials button", "footer a[aria-label]", "#sponsors a", "#collaborators a"]) {
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

test("carousel controls change the selected testimonial", async ({ page }) => {
	await page.goto("/");
	const pressed = page.locator('#testimonials button[aria-pressed="true"]');
	await expect(pressed).toHaveAttribute("aria-label", /1:/);
	const carousel = page.locator("#testimonials [aria-live]");
	await carousel.focus();
	await carousel.press("ArrowRight");
	await expect(pressed).toHaveAttribute("aria-label", /2:/);
	await page.locator("#testimonials button").last().click();
	await expect(pressed).toHaveAttribute("aria-label", /3:/);
});

test("mobile carousel clips adjacent slides", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/");
	const carousel = page.locator("#testimonials [aria-live]");
	await carousel.scrollIntoViewIfNeeded();
	const portrait = page.locator('#testimonials [role="group"]').first().locator("img");
	const portraitBox = await portrait.boundingBox();
	expect(portraitBox).not.toBeNull();
	expect(Math.abs((portraitBox?.width ?? 0) - (portraitBox?.height ?? 0))).toBeLessThan(1);

	const assertSingleVisibleSlide = async () => {
		const visibleSlides = await page.locator('#testimonials [role="group"]').evaluateAll(slides => {
			const viewport = slides[0]?.parentElement?.parentElement?.getBoundingClientRect();
			if (!viewport) return 0;
			return slides.filter(slide => {
				const box = slide.getBoundingClientRect();
				return box.right > viewport.left && box.left < viewport.right;
			}).length;
		});
		expect(visibleSlides).toBe(1);
	};

	await assertSingleVisibleSlide();
	await page.locator("#testimonials button").last().click();
	await expect(page.locator('#testimonials [role="group"]').first()).toHaveCSS("visibility", "visible");
	await page.waitForTimeout(500);
	await expect(page.locator('#testimonials [role="group"]').first()).toHaveCSS("visibility", "hidden");
	await assertSingleVisibleSlide();
});

test("carousel supports keyboard arrows and swipe", async ({ page }) => {
	await page.goto("/");
	const carousel = page.locator("#testimonials [aria-live]");
	const pressed = page.locator('#testimonials button[aria-pressed="true"]');
	await carousel.focus();
	await carousel.press("ArrowRight");
	await expect(pressed).toHaveAttribute("aria-label", /2:/);

	await carousel.dispatchEvent("pointerdown", {
		pointerId: 1,
		isPrimary: true,
		clientX: 300,
		clientY: 200,
	});
	await carousel.dispatchEvent("pointerup", {
		pointerId: 1,
		isPrimary: true,
		clientX: 100,
		clientY: 200,
	});
	await expect(pressed).toHaveAttribute("aria-label", /3:/);
});

test("keyboard order includes the reduced primary navigation", async ({ page }) => {
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
	expect(focused).not.toContain("#about");
});

test("countdown opens on hover and restores focus after keyboard dismissal", async ({ page }) => {
	await page.addInitScript(() => {
		Date.now = () => new Date("2026-08-15T12:00:00-04:00").getTime();
	});
	await page.goto("/");
	const hotspot = page.locator('#hero button[aria-haspopup="dialog"]');
	await expect(hotspot).toBeAttached();
	const dialog = page.locator("#countdown-dialog");
	await hotspot.hover({ force: true });
	await expect(dialog).toHaveJSProperty("open", true);
	await page.mouse.move(1, 1);
	await expect(dialog).toHaveJSProperty("open", false);
	await hotspot.focus();
	await hotspot.press("Enter");
	await expect(dialog).toHaveJSProperty("open", true);
	await page.keyboard.press("Escape");
	await expect(dialog).toHaveJSProperty("open", false);
	await expect(hotspot).toBeFocused();
});

test("reduced motion disables animated particles", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.goto("/");
	await page.locator("#about").scrollIntoViewIfNeeded();
	await expect(page.locator('[aria-hidden="true"][data-mode="none"]')).toBeAttached();
});
